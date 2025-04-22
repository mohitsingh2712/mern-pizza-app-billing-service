import { ClientSession, ObjectId } from "mongoose";
import { OrderModel } from "./orderModal";
import { IOrder } from "./orderTypes";
import { PaginateQuery } from "../types";

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

    async getOrdersByCustomerId(id: ObjectId) {
        return await OrderModel.find({ customerId: id }, { cart: 0 });
    }
    async getOrderByIdWithCustomer(id: string, customerId?: string) {
        return await OrderModel.findOne({ _id: id }, { cart: 0 }).populate(
            customerId ? "customerId" : "",
        );
    }
    async getOrderById(id: string) {
        return await OrderModel.findOne({ _id: id }, { cart: 0 });
    }
    async getOrderByIdWithProjection(
        id: string,
        projection: Record<string, number>,
    ) {
        return await OrderModel.findOne({ _id: id }, projection).populate(
            "customerId",
        );
    }

    async getAllOrders(
        filter: Record<string, string>,
        paginateQuery: PaginateQuery,
    ) {
        const { page = 1, limit = 10 } = paginateQuery;

        const skip = (Number(page) - 1) * Number(limit);

        const [orders, total] = await Promise.all([
            OrderModel.find(filter)
                .populate("customerId")
                .skip(skip)
                .limit(Number(limit)),
            OrderModel.countDocuments(filter),
        ]);

        return {
            data: orders,
            total,
            pageSize: Number(limit),
            currentPage: Number(page),
        };
    }
    async updateOrderStatus(id: string, status: string) {
        return await OrderModel.findOneAndUpdate(
            { _id: id },
            { orderStatus: status },
            { new: true },
        );
    }
}
