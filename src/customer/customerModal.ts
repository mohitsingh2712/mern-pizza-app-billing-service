import mongoose, { ObjectId } from "mongoose";

export interface IAddress {
    text: string;
    isDefault: boolean;
}
export interface ICustomer {
    _id?: ObjectId;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    addresses: IAddress[];
    createdAt?: Date;
    updatedAt?: Date;
}
const AddressSchema = new mongoose.Schema<IAddress>(
    {
        text: { type: String, required: true },
        isDefault: { type: Boolean },
    },
    { _id: false },
);
const customerSchema = new mongoose.Schema<ICustomer>(
    {
        userId: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        addresses: { type: [AddressSchema], default: [] },
    },
    { timestamps: true },
);

export const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
