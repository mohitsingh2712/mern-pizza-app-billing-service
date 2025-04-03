import { Response } from "express";
import { Request } from "express-jwt";

export class OrderCotroller {
    async create(req: Request, res: Response) {
        return res.json("success");
    }
}
