import mongoose from "mongoose";

export interface IProductPricingCache {
    productId: string;
    priceConfiguration: {
        priceType: "base" | "additional";
        availableOptions: {
            [key: string]: number;
        };
    };
}
const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base", "aditional"],
    },
    availableOptions: {
        type: Object,
        of: Number, // ✅ Correctly defining a Map of numbers
    },
});
const productCacheSchema = new mongoose.Schema<IProductPricingCache>({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    priceConfiguration: {
        type: Object,
        of: priceConfigurationSchema,
    },
});

export const ProductPricingCache = mongoose.model<IProductPricingCache>(
    "ProductPricingCache",
    productCacheSchema,
);
