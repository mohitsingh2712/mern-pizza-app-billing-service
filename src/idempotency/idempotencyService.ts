import { ClientSession } from "mongoose";
import { IOrder } from "../order/orderTypes";
import { Idempotency, IIdempotency } from "./idempotencyModel";

export class IdempotencyService {
    async createIdempotencyKey(
        key: string,
        response: IOrder,
        session: ClientSession,
    ): Promise<IIdempotency[]> {
        // Implement idempotency logic here
        return await Idempotency.create([{ key, response }], { session });
    }

    async getIdempotencyKey(key: string): Promise<IIdempotency | null> {
        return Idempotency.findOne({ key });
    }
}
