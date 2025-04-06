import express from "express";
import { OrderCotroller } from "./orderController";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { CouponService } from "../coupon/couponService";
import { OrderService } from "./orderService";
import { createOrderValidator } from "./orderValidator";
const router = express.Router();
const couponservice = new CouponService();
const orderService = new OrderService();
const orderController = new OrderCotroller(couponservice, orderService);

router.post(
    "/",
    createOrderValidator,
    asyncWraper(orderController.create.bind(orderController)),
);

export default router;
