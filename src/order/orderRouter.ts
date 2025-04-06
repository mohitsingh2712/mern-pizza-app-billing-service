import express from "express";
import { OrderCotroller } from "./orderController";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { CouponService } from "../coupon/couponService";
import { OrderService } from "./orderService";
const router = express.Router();
const couponservice = new CouponService();
const orderService = new OrderService();
const orderController = new OrderCotroller(couponservice, orderService);

router.post("/", asyncWraper(orderController.create.bind(orderController)));

export default router;
