import { Request } from "express";

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
