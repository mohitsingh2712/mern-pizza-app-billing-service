import mongoose from "mongoose";

export interface IIdempotency {
    key: string;
    response: object;
}

const idempotencySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        response: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

// TTL index to expire documents after 48 hours
idempotencySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 48 });

export const Idempotency = mongoose.model("Idempotency", idempotencySchema);
