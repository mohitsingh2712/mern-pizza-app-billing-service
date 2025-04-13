import { checkSchema } from "express-validator";

export const createOrderValidator = checkSchema({
    // Validate the cart is a non-empty array
    cart: {
        in: ["body"],
        exists: {
            errorMessage: "Cart is required",
        },
        isArray: {
            errorMessage: "Cart must be an array",
        },
    },

    // Validate each item in the cart
    "cart.*.name": {
        in: ["body"],
        exists: {
            errorMessage: "Product name is required",
        },
        notEmpty: {
            errorMessage: "Product name cannot be empty",
        },
    },
    "cart.*.image": {
        in: ["body"],
        exists: {
            errorMessage: "Product image is required",
        },
        notEmpty: {
            errorMessage: "Product image cannot be empty",
        },
        isURL: {
            errorMessage: "Product image must be a valid URL",
        },
    },
    "cart.*.qty": {
        in: ["body"],
        exists: {
            errorMessage: "Quantity is required",
        },
        isInt: {
            options: { min: 1 },
            errorMessage: "Quantity must be an integer of at least 1",
        },
    },
    "cart.*.priceConfiguration": {
        in: ["body"],
        exists: {
            errorMessage: "Price configuration is required",
        },
        custom: {
            options: (value) => typeof value === "object" && value !== null,
            errorMessage: "Price configuration must be an object",
        },
    },
    "cart.*.choosenConfiguration": {
        in: ["body"],
        exists: {
            errorMessage: "Chosen configuration is required",
        },
        custom: {
            options: (value) => typeof value === "object" && value !== null,
            errorMessage: "Chosen configuration must be an object",
        },
    },
    "cart.*.choosenConfiguration.priceConfiguration": {
        in: ["body"],
        exists: {
            errorMessage: "Chosen price configuration is required",
        },
        custom: {
            options: (value) => typeof value === "object" && value !== null,
            errorMessage: "Chosen price configuration must be an object",
        },
    },
    "cart.*.choosenConfiguration.selectedToppings": {
        in: ["body"],
        exists: {
            errorMessage: "Selected toppings are required",
        },
        isArray: {
            errorMessage: "Selected toppings must be an array",
        },
    },
    // Validate each topping in selectedToppings array
    "cart.*.choosenConfiguration.selectedToppings.*._id": {
        in: ["body"],
        exists: {
            errorMessage: "Topping ID is required",
        },
        notEmpty: {
            errorMessage: "Topping ID cannot be empty",
        },
    },
    "cart.*.choosenConfiguration.selectedToppings.*.name": {
        in: ["body"],
        exists: {
            errorMessage: "Topping name is required",
        },
        notEmpty: {
            errorMessage: "Topping name cannot be empty",
        },
    },
    "cart.*.choosenConfiguration.selectedToppings.*.price": {
        in: ["body"],
        exists: {
            errorMessage: "Topping price is required",
        },
        isFloat: {
            errorMessage: "Topping price must be a valid number",
        },
    },

    // Validate order-level fields
    address: {
        in: ["body"],
        exists: {
            errorMessage: "Address is required",
        },
        notEmpty: {
            errorMessage: "Address cannot be empty",
        },
    },
    comment: {
        in: ["body"],
        optional: true,
        isString: {
            errorMessage: "Comment must be a string",
        },
    },
    customerId: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Customer ID cannot be empty",
        },
    },
    tenantId: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Tenant ID cannot be empty",
        },
        isString: {
            errorMessage: "Tenant ID must be a string",
        },
    },
    paymentMode: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Payment mode cannot be empty",
        },
        isIn: {
            options: [["cash", "card"]],
            errorMessage: "Invalid payment mode",
        },
    },
});
