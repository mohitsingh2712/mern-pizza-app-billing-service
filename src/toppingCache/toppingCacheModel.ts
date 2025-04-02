import mongoose from "mongoose";

export interface IToppingCache {
    name: string;
    price: number;
    tenantId: string;
}

const ToppingCacheSchema = new mongoose.Schema<IToppingCache>(
    {
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
    },
    {
        timestamps: true,
    },
);

export const ToppingCache = mongoose.model<IToppingCache>(
    "ToppingPricingCache",
    ToppingCacheSchema,
);
