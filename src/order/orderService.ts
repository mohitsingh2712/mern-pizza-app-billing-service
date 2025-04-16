import { ClientSession } from "mongoose";
import { OrderModel } from "./orderModal";
import { IOrder } from "./orderTypes";

export class OrderService {
    async createOrder(
        order: IOrder,
        session: ClientSession,
    ): Promise<IOrder[]> {
        return await OrderModel.create([order], { session });
    }
    async updateOrderPaymentStatus(id: string, status: string) {
        return await OrderModel.findOneAndUpdate(
            { _id: id },
            { paymentStatus: status },
            { new: true },
        );
    }

    async getOrdersByCustomerId(id: string) {
        return await OrderModel.find({ customerId: id }, { cart: 0 });
    }
}
