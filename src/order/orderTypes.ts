import { ObjectId } from "mongoose";
import { ICartItem } from "../types";
export enum PaymentModeEnum {
    CARD = "card",
    CASH = "cash",
}
export enum OrderStatusEnum {
    RECEIVED = "received",
    CONFIRMED = "confirmed",
    PERPARING = "preparing",
    READY_FOR_DELIVERY = "ready_for_delivery",
    OUR_FOR_DEVLIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}
export enum PaymentStatusEnum {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
}

export interface IOrder {
    cart: ICartItem[];
    customerId: ObjectId;
    total: number;
    discount: number;
    deliveryCharges: number;
    taxes: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: PaymentModeEnum;
    orderStatus: OrderStatusEnum;
    paymentStatus: PaymentStatusEnum;
    paymentId?: string;
}
