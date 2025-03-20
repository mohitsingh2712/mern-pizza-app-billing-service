import { checkSchema } from "express-validator";

export default checkSchema({
    title: {
        errorMessage: "Title is required",
        notEmpty: true,
    },
    code: {
        errorMessage: "Code is required",
        notEmpty: true,
        isLength: {
            errorMessage: "Code should be 10 characters long",
            options: { min: 10, max: 10 },
        },
        custom: {
            errorMessage:
                "Code should only contain uppercase letters and numbers",
            options: (value: string) => /^[A-Z0-9]+$/.test(value),
        },
    },
    discount: {
        errorMessage: "Discount is required",
        notEmpty: true,
        isInt: {
            errorMessage: "Discount should be a positive integer",
            options: { gt: 0 },
        },
        custom: {
            errorMessage: "Discount should be between 1 and 100",
            options: (value: number) => value >= 1 && value <= 100,
        },
    },
    validUpto: {
        notEmpty: true,
        errorMessage: "Valid until date is required",
        isDate: {
            errorMessage: "Valid until date should be a valid date",
        },
    },

    tenantId: {
        notEmpty: true,
        errorMessage: "Tenant ID is required",
        isInt: {
            errorMessage: "Tenant ID should be a positive integer",
            options: { gt: 0 },
        },
    },
});
