import { IToppingCache, ToppingCache } from "./toppingCacheModel";

/* eslint-disable no-console */
interface ITopping extends IToppingCache {
    _id: string;
}

export const handleToppingUpdate = async (value?: string) => {
    if (!value) {
        console.error("Invalid product update message");
        return;
    }

    let topping: ITopping | undefined;
    try {
        topping = JSON.parse(value) as ITopping;
    } catch (error) {
        console.error("Error parsing product update message", error);
        return; // Return early if parsing fails
    }

    if (!topping?._id || !topping?.price || !topping?.tenantId) {
        console.error("Missing required topping fields", topping);
        return;
    }

    return await ToppingCache.updateOne(
        { toppingId: topping._id }, // Filter
        { $set: { price: topping.price, tenantId: topping.tenantId } }, // Update operation
        { upsert: true }, // Options
    );
};
