import { Request } from "express";

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}
