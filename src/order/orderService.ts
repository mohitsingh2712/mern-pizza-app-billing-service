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
}
