import { Idempotency, IIdempotency } from "./idempotencyModel";

export class IdempotencyService {
    // async createIdempotencyKey(key: string): Promise<void> {
    //     // Implement idempotency logic here
    //     return Idempotency.create
    // }

    async getIdempotencyKey(key: string): Promise<IIdempotency | null> {
        return Idempotency.findOne({ key });
    }
}
