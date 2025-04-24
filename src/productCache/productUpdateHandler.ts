/* eslint-disable no-console */
import { ProductMessage } from "../types";
import { ProductPricingCache } from "./productCacheModel";

export const handleProductUpdate = async (value?: string) => {
    if (!value) {
        console.error("Invalid product update message");
        return;
    }
    let product: ProductMessage | undefined = undefined;
    try {
        product = JSON.parse(value) as ProductMessage;
    } catch (error) {
        console.error("Error parsing product update message", error);
    }

    return await ProductPricingCache.updateOne(
        {
            productId: product?.data?._id,
        },
        {
            $set: {
                priceConfiguration: product?.data?.priceConfiguration,
            },
        },
        {
            upsert: true,
        },
    );
};
