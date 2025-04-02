/* eslint-disable no-console */
import { IProductPricingCache, ProductPricingCache } from "./productCacheModel";
interface IProduct extends IProductPricingCache {
    _id: string;
}

export const handleProductUpdate = async (value?: string) => {
    if (!value) {
        console.error("Invalid product update message");
        return;
    }
    let product: IProduct | undefined = undefined;
    try {
        product = JSON.parse(value) as IProduct;
    } catch (error) {
        console.error("Error parsing product update message", error);
    }

    return await ProductPricingCache.updateOne(
        {
            productId: product?._id,
        },
        {
            $set: {
                priceConfiguration: product?.priceConfiguration,
            },
        },
        {
            upsert: true,
        },
    );
};
