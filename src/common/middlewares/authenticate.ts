import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksClient from "jwks-rsa";
import { Request } from "express";
import config from "config";

// JWT Middleware for Authentication
const jwtMiddleware = expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: config.get("auth.jwksUri"),
        cache: true,
        rateLimit: true,
    }) as unknown as GetVerificationKey,
    algorithms: ["RS256"],
    getToken(req: Request) {
        const authHeader = req?.headers?.authorization;
        if (authHeader?.split(" ")[1] !== undefined) {
            const token = authHeader?.split(" ")[1];
            if (token) {
                return token;
            }
        }

        const { accessToken } = req?.cookies as Record<string, string>;
        return accessToken;
    },
});

export default jwtMiddleware;
