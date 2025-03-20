import { Coupon } from "./couponModal";
import { ICoupon } from "./couponTypes";

export class CouponService {
    async createCoupon(coupon: ICoupon): Promise<ICoupon> {
        return await Coupon.create(coupon);
    }
    async updateCoupon(id: string, coupon: ICoupon): Promise<ICoupon | null> {
        return await Coupon.findByIdAndUpdate(id, coupon, {
            new: true,
        });
    }
    async getCoupon(id: string): Promise<ICoupon | null> {
        return await Coupon.findById(id);
    }
    async getAllCoupons(): Promise<ICoupon[]> {
        return await Coupon.find({});
    }
    async deleteCoupon(id: string): Promise<void> {
        await Coupon.findByIdAndDelete(id);
    }
    async getAllTenantCoupons(tenant: number): Promise<ICoupon[]> {
        return await Coupon.find({ tenantId: tenant });
    }
}
