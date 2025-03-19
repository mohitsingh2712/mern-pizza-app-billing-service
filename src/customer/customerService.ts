import { Customer, ICustomer } from "./customerModal";

export class CustomerService {
    async getCustomer(userId: string): Promise<ICustomer | null> {
        return await Customer.findOne({ userId });
    }

    async findCustomerAndUpdateAddress(
        id: string,
        userId: string,
        address: string,
    ): Promise<ICustomer | null> {
        return await Customer.findOneAndUpdate(
            { _id: id, userId },
            { $push: { addresses: { text: address, isDefault: false } } },
            { new: true },
        );
    }

    async createCustomer(userData: ICustomer): Promise<ICustomer> {
        return await Customer.create(userData);
        // implementation
    }
}
