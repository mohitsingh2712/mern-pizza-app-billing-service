/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable no-console */
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { ICartItem, ITopping, OrderRequest, ROLES } from "../types";
import {
    IProductPricingCache,
    ProductPricingCache,
} from "../productCache/productCacheModel";
import { IToppingCache, ToppingCache } from "../toppingCache/toppingCacheModel";
import { CouponService } from "../coupon/couponService";
import { OrderService } from "./orderService";
import {
    IOrder,
    OrderStatusEnum,
    PaymentModeEnum,
    PaymentStatusEnum,
} from "./orderTypes";
import { validationResult } from "express-validator";
import { IdempotencyService } from "../idempotency/idempotencyService";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { PaymentGW } from "../payment/paymentTypes";
import { MessageBroker } from "../types/broker";
import { CustomerService } from "../customer/customerService";
import { ICustomer } from "../customer/customerModal";

export class OrderCotroller {
    constructor(
        private couponService: CouponService,
        private orderService: OrderService,
        private idempotencyService: IdempotencyService,
        private paymentGw: PaymentGW,
        private broker: MessageBroker,
        private customerService: CustomerService,
    ) {}
    async create(req: Request, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }

        const body = req.body as OrderRequest;
        const {
            cart,
            couponCode,
            tenantId,
            paymentMode,
            customerId,
            comment,
            address,
        } = body;
        const totalPrice = await this.calculateTotalPrice(cart);
        let discount = 0;
        if (couponCode) {
            discount = await this.calculateDiscount(
                body.couponCode,
                body.tenantId,
            );
        }
        const discountAmount = Math.round((totalPrice * discount) / 100);
        const priceAfterDiscount = totalPrice - discountAmount;
        const TAXES_PERCENT = 18;
        const DELIVERY_CHARGES = 100;
        const taxesAmount = Math.round(
            (priceAfterDiscount * TAXES_PERCENT) / 100,
        );
        const finalPrice = priceAfterDiscount + taxesAmount + DELIVERY_CHARGES;

        const idempotencyKey = req.headers["idempotency-key"] as string;

        if (!idempotencyKey) {
            const err = createHttpError(400, "Idempotency key is required");
            throw err;
        }
        const idempotency =
            await this.idempotencyService.getIdempotencyKey(idempotencyKey);
        let newOrder: IOrder[] | [] = idempotency
            ? [idempotency.response as IOrder]
            : [];
        if (!idempotency) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                newOrder = await this.orderService.createOrder(
                    {
                        cart,
                        address,
                        comment,
                        customerId,
                        deliveryCharges: DELIVERY_CHARGES,
                        discount: discountAmount,
                        taxes: taxesAmount,
                        total: finalPrice,
                        tenantId,
                        orderStatus: OrderStatusEnum.RECEIVED,
                        paymentMode: paymentMode as PaymentModeEnum,
                        paymentStatus: PaymentStatusEnum.PENDING,
                    },
                    session,
                );
                await this.idempotencyService.createIdempotencyKey(
                    idempotencyKey,
                    newOrder[0],
                    session,
                );
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                await session.endSession();
            }
        }
        if (!newOrder) {
            const err = createHttpError(400, "Error creating order");
            throw err;
        }
        if ((body.paymentMode as PaymentModeEnum) === PaymentModeEnum.CARD) {
            const session = await this.paymentGw.createSession({
                idempotentKey: idempotencyKey,
                amount: finalPrice,
                orderId: String(newOrder[0]._id),
                currency: "inr",
                tenantId: newOrder[0].tenantId,
            });
            await this.broker.sendMessage(
                "billing",
                JSON.stringify(newOrder[0]),
            );

            return res.json({
                paymentUrl: session.paymentUrl,
                order: newOrder[0],
            });
        }
        await this.broker.sendMessage("billing", JSON.stringify(newOrder[0]));
        res.status(200).json({
            message: "Webhook received",
        });
        return res.json({ paymentUrl: null, order: newOrder[0] });
    }

    async getAllOrders(req: Request, res: Response) {
        const { role } = req.auth as { sub: string; role: ROLES };
        const tenantId = req.query.tenantId;
        if (role === ROLES.CUSTOMER) {
            const err = createHttpError(
                400,
                "Customer not allowed to access this endpoint",
            );
            throw err;
        }
        const paginateQuery = {
            page: req.query.currentPage
                ? parseInt(req.query.currentPage as string)
                : 1,
            limit: req.query.perPage
                ? parseInt(req.query.perPage as string)
                : 10,
        };
        if (role === ROLES.ADMIN) {
            const filter: Record<string, string> = {};
            if (tenantId) {
                filter.tenantId = tenantId as string;
            }
            const orders = await this.orderService.getAllOrders(
                filter,
                paginateQuery,
            );
            return res.status(200).json(orders);
        }
        if (role === ROLES.MANGER) {
            const orders = await this.orderService.getAllOrders(
                { tenantId: tenantId as string },
                paginateQuery,
            );
            return res.status(200).json(orders);
        }
    }

    async getOrders(req: Request, res: Response) {
        const userId = req.auth?.sub;
        if (!userId) {
            const err = createHttpError(400, "User id is required");
            throw err;
        }
        const customer = await this.customerService.getCustomer(userId);
        if (!customer || !("_id" in customer)) {
            const err = createHttpError(400, "Customer not found or invalid");
            throw err;
        }

        const orders = await this.orderService.getOrdersByCustomerId(
            customer._id!,
        );
        res.status(200).json({
            orders,
        });
    }

    async getOrder(req: Request, res: Response, next: NextFunction) {
        console.log(req.query.fields);
        const {
            sub: userId,
            role,
            tenantId,
        } = req.auth as { sub: string; role: ROLES; tenantId: string };
        const fields = req.query.fields
            ? req?.query?.fields?.toString().split(",")
            : []; //[orderStatus,paymentStatus]
        const projection = fields.reduce(
            (acc, field) => {
                acc[field] = 1;
                return acc;
            },
            { customerId: 1 } as Record<string, number>,
        );

        const orderId = req.params.id;
        if (!orderId) {
            const err = createHttpError(400, "Order id is required");
            throw err;
        }
        if (!userId) {
            const err = createHttpError(400, "User id is required");
            throw err;
        }
        const order = await this.orderService.getOrderByIdWithProjection(
            orderId,
            projection,
        );
        if (!order) {
            const err = createHttpError(400, "Order not found");
            throw err;
        }
        if (role === ROLES.ADMIN) {
            return res.status(200).json({
                order,
            });
        }
        const myRestaurantOrder = order.tenantId.toString() === tenantId;

        if (role === ROLES.MANGER && myRestaurantOrder) {
            return res.status(200).json({
                order,
            });
        }
        if (role === ROLES.CUSTOMER) {
            const customer = await this.customerService.getCustomer(userId);

            if (!customer || !("_id" in customer)) {
                const err = createHttpError(
                    400,
                    "Customer not found or invalid",
                );
                throw err;
            }
            if (
                (order.customerId as ICustomer)?._id?.toString() ===
                customer._id?.toString()
            ) {
                return res.status(200).json({
                    order,
                });
            }
        }
        return next(
            createHttpError(403, "You are not authorized to access this order"),
        );
    }
    async changeStatus(req: Request, res: Response) {
        const { role } = req.auth as { sub: string; role: ROLES };
        const orderId = req.params.id;
        const { status } = req.body as { status: OrderStatusEnum };
        if (!orderId) {
            const err = createHttpError(400, "Order id is required");
            throw err;
        }
        if (!status) {
            const err = createHttpError(400, "Status is required");
            throw err;
        }
        if (role !== ROLES.MANGER && role !== ROLES.ADMIN) {
            const err = createHttpError(
                400,
                "Only manager or admin can change the order status",
            );
            throw err;
        }
        const order = await this.orderService.updateOrderStatus(
            orderId,
            status,
        );
        res.status(200).json({
            order,
        });
    }

    private async calculateTotalPrice(cart: ICartItem[]) {
        const productIds = cart.map((item) => item._id);
        const productPricings = await ProductPricingCache.find({
            productId: { $in: productIds },
        });
        const cartToppingsIds = cart
            .map((item) =>
                item.choosenConfiguration.selectedToppings.map(
                    (topping) => topping._id,
                ),
            )
            .flat();
        const toppingPricings = await ToppingCache.find({
            toppingId: { $in: cartToppingsIds },
        });

        const totalPrice = cart.reduce((acc, item) => {
            const cachedProduct = productPricings.find(
                (p) => p.productId === item._id,
            );
            if (!cachedProduct) {
                return acc;
            }

            return (
                acc +
                item.qty *
                    this.getItemTotal(item, cachedProduct, toppingPricings)
            );
        }, 0);
        return totalPrice;
    }
    private getItemTotal(
        item: ICartItem,
        cachedProductPrice: IProductPricingCache,
        toppingsPricings: IToppingCache[],
    ) {
        const toppingsTotal = item.choosenConfiguration.selectedToppings.reduce(
            (acc, curr) => {
                return (
                    acc + this.getCurrentToppingPrice(curr, toppingsPricings)
                );
            },
            0,
        );
        const productTotal = Object.entries(
            item.choosenConfiguration.priceConfiguration,
        ).reduce((acc, [key, value]) => {
            const price =
                cachedProductPrice.priceConfiguration[key].availableOptions[
                    value
                ];
            return acc + price;
        }, 0);
        return toppingsTotal + productTotal;
    }
    private getCurrentToppingPrice(
        topping: ITopping,
        productToppings: IToppingCache[],
    ) {
        const toppingPrice = productToppings.find(
            (t) => t.toppingId === topping._id,
        );
        if (!toppingPrice) {
            return topping.price;
        }
        return toppingPrice.price;
    }
    private async calculateDiscount(couponCode: string, tenantId: string) {
        const coupon = await this.couponService.getCouponByCodeAndTenantId(
            couponCode,
            Number(tenantId),
        );

        if (!coupon) {
            return 0;
        }

        // Check if coupon is valid
        if (new Date(coupon.validUpto) < new Date()) {
            return 0;
        }

        return coupon.discount;
    }
}
