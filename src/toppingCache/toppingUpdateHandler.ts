import { ToppingMessage } from "../types";
import { ToppingCache } from "./toppingCacheModel";

/* eslint-disable no-console */

export const handleToppingUpdate = async (value?: string) => {
    if (!value) {
        console.error("Invalid product update message");
        return;
    }

    let topping: ToppingMessage | undefined;
    try {
        topping = JSON.parse(value) as ToppingMessage;
    } catch (error) {
        console.error("Error parsing product update message", error);
        return;
    }

    if (
        !topping?.data?._id ||
        !topping?.data?.price ||
        !topping?.data?.tenantId
    ) {
        console.error("Missing required topping fields", topping);
        return;
    }

    return await ToppingCache.updateOne(
        { toppingId: topping.data._id }, // Filter
        {
            $set: {
                price: topping.data.price,
                tenantId: topping.data.tenantId,
            },
        }, // Update operation
        { upsert: true }, // Options
    );
};
