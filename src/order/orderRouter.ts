import express from "express";
import { OrderCotroller } from "./orderController";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { CouponService } from "../coupon/couponService";
const router = express.Router();
const couponservice = new CouponService();
const orderController = new OrderCotroller(couponservice);

router.post("/", asyncWraper(orderController.create.bind(orderController)));

export default router;
