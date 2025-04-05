import mongoose from "mongoose";
import { ProductPriceConfiguration } from "../types";

export interface PriceConfiguration {
    priceType: "base" | "aditional";
    availableOptions: {
        [key: string]: number;
    };
}
export interface IProductPricingCache {
    productId: string;
    priceConfiguration: ProductPriceConfiguration;
}
const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base", "aditional"],
    },
    availableOptions: {
        type: Object,
        of: Number,
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
