import { Request } from "express";
import { ObjectId } from "mongoose";

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        tenant: string;
    };
}

export interface UpdateAddressRequest extends Request {
    address: string;
}

export interface ITopping {
    _id: string;
    name: string;
    price: number;
}
export interface ProductPriceConfiguration {
    [key: string]: {
        priceType: "base" | "aditional";
        availableOptions: {
            [key: string]: number;
        };
    };
}

export type IProduct = {
    _id: string;
    name: string;
    image: string;
    description: string;
    priceConfiguration: ProductPriceConfiguration;
};
export interface ICartItem
    extends Pick<IProduct, "_id" | "name" | "image" | "priceConfiguration"> {
    choosenConfiguration: {
        priceConfiguration: {
            [key: string]: string;
        };
        selectedToppings: ITopping[];
    };
    qty: number;
}

export interface OrderRequest {
    cart: ICartItem[];
    couponCode: string;
    tenantId: string;
    comment: string;
    address: string;
    customerId: ObjectId;
    paymentMode: string;
}

export enum ROLES {
    ADMIN = "admin",
    CUSTOMER = "customer",
    MANGER = "manager",
}

export interface PaginateQuery {
    page: number;
    limit: number;
}

export enum OrderEvents {
    ORDER_CREATE = "ORDER_CREATE",
    PAYMENT_STATUS_UPDATE = "PAYMENT_STATUS_UPDATE",
    ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE",
}
