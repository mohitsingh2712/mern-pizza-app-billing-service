import { OrderModel } from "./orderModal";
import { IOrder } from "./orderTypes";

export class OrderService {
    async createOrder(order: IOrder): Promise<IOrder> {
        return await OrderModel.create(order);
    }
}
