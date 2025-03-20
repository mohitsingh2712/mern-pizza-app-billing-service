import { NextFunction, Request, Response } from "express";
import { ICouponRequest } from "./couponTypes";
import { CouponService } from "./couponService";
import { AuthRequest } from "../types";
import createHttpError from "http-errors";

export class CouponController {
    constructor(private couponService: CouponService) {}
    async createCoupon(req: Request, res: Response, next: NextFunction) {
        const { title, code, discount, tenantId, validUpto } =
            req.body as ICouponRequest;
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            const error = createHttpError(403, "Forbidden");
            return next(error);
        }
        if (role === "manager" && String(tenantId) !== String(tenant)) {
            const error = createHttpError(403, "Forbidden");
            return next(error);
        }
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
    async updateCoupon(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const existingCoupon = await this.couponService.getCoupon(id);
        if (!existingCoupon) {
            const error = createHttpError(404, "Coupon not found");
            return next(error);
        }
        const { title, code, discount, tenantId, validUpto } =
            req.body as ICouponRequest;
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            const error = createHttpError(403, "Forbidden");
            return next(error);
        }
        if (role === "manager" && String(tenantId) !== String(tenant)) {
            const error = createHttpError(403, "Forbidden");
            return next(error);
        }

        const coupon = {
            title,
            code,
            discount,
            tenantId,
            validUpto,
        };
        const updatedCoupon = await this.couponService.updateCoupon(id, coupon);
        if (!updatedCoupon) {
            const error = createHttpError(404, "Coupon not found");
            return next(error);
        }

        res.json(updatedCoupon);
    }
    async getAllCoupon(req: Request, res: Response, next: NextFunction) {
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            const error = createHttpError(403, "Forbidden");
            return next(error);
        }
        if (role === "manager") {
            const coupons = await this.couponService.getAllTenantCoupons(
                Number(tenant),
            );
            return res.json(coupons);
        }

        const coupons = await this.couponService.getAllCoupons();
        return res.json(coupons);
    }
    async deleteCoupon(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const existingCoupon = await this.couponService.getCoupon(id);
        if (!existingCoupon) {
            const error = createHttpError(404, "Coupon not found");
            return next(error);
        }
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            const error = createHttpError(404, "Coupon not found");
            return next(error);
        }
        if (
            role === "manager" &&
            String(existingCoupon.tenantId) !== String(tenant)
        ) {
            const error = createHttpError(403, "Forbidden");
            return next(error);
        }
        await this.couponService.deleteCoupon(id);
        res.json({ message: "Coupon deleted" });
    }

    async verifyCoupon(req: Request, res: Response, next: NextFunction) {
        const { code, tenantId } = req.body as ICouponRequest;
        const coupon = await this.couponService.getCouponByCodeAndTenantId(
            code,
            Number(tenantId),
        );
        if (!coupon) {
            const err = createHttpError(404, "Coupon not found");
            return next(err);
        }
        // Check if coupon is valid
        if (new Date(coupon.validUpto) < new Date()) {
            const err = createHttpError(400, "Coupon expired");
            return next(err);
        }
        res.json({ success: true, discount: coupon.discount });
    }
}
