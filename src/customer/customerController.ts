import { Request, Response } from "express";
import { AuthRequest, UpdateAddressRequest } from "../types";
import { CustomerService } from "./customerService";

export class CustomerController {
    constructor(private customerService: CustomerService) {}
    async getCustomer(req: Request, res: Response) {
        const {
            sub: userId,
            firstName,
            lastName,
            email,
        } = (req as AuthRequest).auth;

        const customer = await this.customerService.getCustomer(userId);
        if (!customer) {
            const newCustomer = await this.customerService.createCustomer({
                userId,
                firstName,
                lastName,
                email,
                addresses: [],
            });

            return res.json(newCustomer);
        }
        res.json(customer);
    }
    async addAdress(req: Request, res: Response) {
        const { sub: userId } = (req as AuthRequest).auth;
        const address = (req.body as UpdateAddressRequest).address;

        const customer =
            await this.customerService.findCustomerAndUpdateAddress(
                req.params.id,
                userId,
                address,
            );
        res.json(customer);
    }
}
