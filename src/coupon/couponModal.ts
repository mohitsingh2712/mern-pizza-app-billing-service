import mongoose from "mongoose";
import { ICoupon } from "./couponTypes";

const CouponSchema = new mongoose.Schema<ICoupon>({
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    validUpto: { type: Date, required: true },
    tenantId: { type: Number, required: true },
    // other fields
});
CouponSchema.index({ code: 1, tenantId: 1 }, { unique: true });
export const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);
