import express from "express";
import { CouponService } from "./couponService";
import { CouponController } from "./couponController";
import authenticate from "../common/middlewares/authenticate";
import couponValidator from "./couponValidator";

const couponserviec = new CouponService();
const couponController = new CouponController(couponserviec);
const router = express.Router();

router.post(
    "/",
    authenticate,
    couponValidator,
    couponController.createCoupon.bind(couponController),
);

export default router;
