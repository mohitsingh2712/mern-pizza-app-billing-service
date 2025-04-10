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
        return await OrderModel.updateOne(
            { _id: id },
            { paymentStatus: status },
            { new: true },
        );
    }
}
