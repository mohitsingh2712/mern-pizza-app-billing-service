import { Customer, ICustomer } from "./customerModal";

export class CustomerService {
    async getCustomer(userId: string): Promise<ICustomer | null> {
        return await Customer.findOne({ userId });
    }

    async createCustomer(userData: ICustomer): Promise<ICustomer> {
        return await Customer.create(userData);
        // implementation
    }
}
