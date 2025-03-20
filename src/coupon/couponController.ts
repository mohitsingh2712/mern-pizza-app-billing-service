import { Request, Response } from "express";
import { ICouponRequest } from "./couponTypes";
import { CouponService } from "./couponService";

export class CouponController {
    constructor(private couponService: CouponService) {}
    async createCoupon(req: Request, res: Response) {
        const { title, code, discount, tenantId, validUpto } =
            req.body as ICouponRequest;
        const coupon = {
            title,
            code,
            discount,
            tenantId,
            validUpto,
        };
        const createdCoupon = await this.couponService.createCoupon(coupon);

        res.json(createdCoupon);
    }
}
