import express from "express";
import { OrderCotroller } from "./orderController";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { CouponService } from "../coupon/couponService";
import { OrderService } from "./orderService";
import { createOrderValidator } from "./orderValidator";
import { IdempotencyService } from "../idempotency/idempotencyService";
import { StripeGW } from "../payment/stripe";
import { createMessageBroker } from "../common/factories/brokerFactory";
import authenticate from "../common/middlewares/authenticate";
import { CustomerService } from "../customer/customerService";
import { orderStatusValidator } from "./orderStatusValidator";

const router = express.Router();
const paymentGw = new StripeGW();
const couponservice = new CouponService();
const orderService = new OrderService();
const idempotencyService = new IdempotencyService();
const customerService = new CustomerService();
const broker = createMessageBroker();
const orderController = new OrderCotroller(
    couponservice,
    orderService,
    idempotencyService,
    paymentGw,
    broker,
    customerService,
);

router.post(
    "/",
    createOrderValidator,
    // authenticate,
    asyncWraper(orderController.create.bind(orderController)),
);
router.get(
    "/orders/mine",
    authenticate,
    asyncWraper(orderController.getOrders.bind(orderController)),
);
router.get(
    "/orders/:id",
    authenticate,
    asyncWraper(orderController.getOrder.bind(orderController)),
);

router.get(
    "/",
    authenticate,
    asyncWraper(orderController.getAllOrders.bind(orderController)),
);
router.patch(
    "/changeStatus/:id",
    orderStatusValidator,
    authenticate,
    asyncWraper(orderController.changeStatus.bind(orderController)),
);

export default router;
