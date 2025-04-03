import mongoose from "mongoose";

export interface IToppingCache {
    price: number;
    tenantId: string;
    toppingId: string;
}

const ToppingCacheSchema = new mongoose.Schema<IToppingCache>(
    {
        toppingId: {
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
