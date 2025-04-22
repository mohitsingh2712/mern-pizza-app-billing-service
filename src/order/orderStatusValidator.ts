import { checkSchema } from "express-validator";
import { OrderStatusEnum } from "./orderTypes";

export const orderStatusValidator = checkSchema({
    status: {
        in: ["body"],
        exists: {
            errorMessage: "Status is required",
        },
        isIn: {
            options: [
                Object.values(OrderStatusEnum).map((status) =>
                    status.toString(),
                ),
            ],
            errorMessage: `Status must be one of the following: ${Object.values(
                OrderStatusEnum,
            ).join(", ")}`,
        },
    },
    id: {
        in: ["params"],
        exists: {
            errorMessage: "Order ID is required",
        },
        isMongoId: {
            errorMessage: "Order ID must be a valid MongoDB ObjectId",
        },
    },
});
