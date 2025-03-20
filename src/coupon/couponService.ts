import { Coupon } from "./couponModal";
import { ICoupon } from "./couponTypes";

export class CouponService {
    async createCoupon(coupon: ICoupon): Promise<ICoupon> {
        return await Coupon.create(coupon);
    }
}
