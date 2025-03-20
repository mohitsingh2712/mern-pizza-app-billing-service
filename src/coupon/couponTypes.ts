import { Request } from "express";

export interface ICoupon {
    title: string;
    code: string;
    discount: number;
    validUpto: Date;
    tenantId: number;
}

export interface ICouponRequest extends Request {
    title: string;
    code: string;
    discount: number;
    validUpto: Date;
    tenantId: number;
}
