import express from "express";
import { OrderCotroller } from "./orderController";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { CouponService } from "../coupon/couponService";
import { OrderService } from "./orderService";
import { createOrderValidator } from "./orderValidator";
import { IdempotencyService } from "../idempotency/idempotencyService";
import { StripeGW } from "../payment/stripe";
// import authenticate from "../common/middlewares/authenticate";

const router = express.Router();
const paymentGw = new StripeGW();
const couponservice = new CouponService();
const orderService = new OrderService();
const idempotencyService = new IdempotencyService();
const orderController = new OrderCotroller(
    couponservice,
    orderService,
    idempotencyService,
    paymentGw,
);

router.post(
    "/",
    createOrderValidator,
    // authenticate,
    asyncWraper(orderController.create.bind(orderController)),
);

export default router;
