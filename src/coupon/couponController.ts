import { Request, Response } from "express";
import { ICouponRequest } from "./couponTypes";
import { CouponService } from "./couponService";
import { AuthRequest } from "../types";

export class CouponController {
    constructor(private couponService: CouponService) {}
    async createCoupon(req: Request, res: Response) {
        const { title, code, discount, tenantId, validUpto } =
            req.body as ICouponRequest;
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (role === "manager" && String(tenantId) !== String(tenant)) {
            return res.status(403).json({ message: "Forbidden" });
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
    async updateCoupon(req: Request, res: Response) {
        const id = req.params.id;
        const existingCoupon = await this.couponService.getCoupon(id);
        if (!existingCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        const { title, code, discount, tenantId, validUpto } =
            req.body as ICouponRequest;
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (role === "manager" && String(tenantId) !== String(tenant)) {
            return res.status(403).json({ message: "Forbidden" });
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
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.json(updatedCoupon);
    }
    async getAllCoupon(req: Request, res: Response) {
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            return res.status(403).json({ message: "Forbidden" });
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
    async deleteCoupon(req: Request, res: Response) {
        const id = req.params.id;
        const existingCoupon = await this.couponService.getCoupon(id);
        if (!existingCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        const { role, tenant } = (req as AuthRequest).auth;
        if (role !== "admin" && role !== "manager") {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (
            role === "manager" &&
            String(existingCoupon.tenantId) !== String(tenant)
        ) {
            return res.status(403).json({ message: "Forbidden" });
        }
        await this.couponService.deleteCoupon(id);
        res.json({ message: "Coupon deleted" });
    }
}
