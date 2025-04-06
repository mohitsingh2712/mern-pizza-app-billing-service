import mongoose from "mongoose";
import {
    IOrder,
    OrderStatusEnum,
    PaymentModeEnum,
    PaymentStatusEnum,
} from "./orderTypes";
import { ICartItem } from "../types";

const ToppingSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    tenantId: {
        type: String,
        required: true,
    },
});

const cartSchema = new mongoose.Schema<ICartItem>({
    name: String,
    image: String,
    qty: Number,
    priceConfiguration: {
        type: Map,
        of: {
            priceType: {
                type: String,
                enum: ["base", "aditional"],
                required: true,
            },
            availableOptions: {
                type: Map,
                of: Number,
                required: true,
            },
        },
    },
    choosenConfiguration: {
        priceConfiguration: {
            type: Map,
            of: String,
        },
        selectedToppings: [ToppingSchema],
    },
});
const orderSchema = new mongoose.Schema<IOrder>(
    {
        cart: {
            type: [cartSchema],
            required: true,
        },
        address: {
            type: String,
            reqiured: true,
        },
        comment: {
            type: String,
        },
        customerId: {
            type: mongoose.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        deliveryCharges: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        taxes: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        tenantId: {
            type: String,
            required: true,
        },
        orderStatus: {
            type: String,
            enum: OrderStatusEnum,
        },
        paymentMode: {
            type: String,
            enum: PaymentModeEnum,
        },
        paymentStatus: {
            type: String,
            enum: PaymentStatusEnum,
        },
        paymentId: {
            type: String,
            required: false,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);
export const OrderModel = mongoose.model("Order", orderSchema);
