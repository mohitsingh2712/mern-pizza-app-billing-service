import { Request, Response } from "express";

export class CustomerController {
    async getCustomer(req: Request, res: Response) {
        res.json({ message: "Get customer" });
    }
}
