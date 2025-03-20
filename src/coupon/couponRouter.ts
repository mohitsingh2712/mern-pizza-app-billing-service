import express from "express";
import { CouponService } from "./couponService";
import { CouponController } from "./couponController";
import authenticate from "../common/middlewares/authenticate";
import couponValidator from "./couponValidator";
import { asyncWraper } from "../common/utils/asyncWrapper";

const couponserviec = new CouponService();
const couponController = new CouponController(couponserviec);
const router = express.Router();

router.post(
    "/",
    authenticate,
    couponValidator,
    asyncWraper(couponController.createCoupon.bind(couponController)),
);
router.put(
    "/:id",
    authenticate,
    couponValidator,
    asyncWraper(couponController.updateCoupon.bind(couponController)),
);
router.get(
    "/",
    authenticate,
    asyncWraper(couponController.getAllCoupon.bind(couponController)),
);
router.delete(
    "/:id",
    authenticate,
    asyncWraper(couponController.deleteCoupon.bind(couponController)),
);
router.post(
    "/verify",
    asyncWraper(couponController.verifyCoupon.bind(couponController)),
);

export default router;
