/* eslint-disable no-console */
import { Response } from "express";
import { Request } from "express-jwt";
import { ICartItem, ITopping, OrderRequest } from "../types";
import {
    IProductPricingCache,
    ProductPricingCache,
} from "../productCache/productCacheModel";
import { IToppingCache, ToppingCache } from "../toppingCache/toppingCacheModel";
import { CouponService } from "../coupon/couponService";

export class OrderCotroller {
    constructor(private couponService: CouponService) {}
    async create(req: Request, res: Response) {
        const body = req.body as OrderRequest;
        const totalPrice = await this.calculateTotalPrice(body.cart);
        let discount = 0;
        if (body.couponCode) {
            discount = await this.calculateDiscount(
                body.couponCode,
                body.tenantId,
            );
        }
        const discountAmount = Math.round((totalPrice * discount) / 100);
        const priceAfterDiscount = totalPrice - discountAmount;

        return res.json({ priceAfterDiscount });
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
