import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "config";
//routes
import customerRouter from "./customer/customerRouter";
import couponRouter from "./coupon/couponRouter";
import orderRouter from "./order/orderRouter";
import paymentRouter from "./payment/paymentRouter";
const app = express();
const allowedOrigins = [
    config.get("frontend.client"),
    config.get("frontend.admin"),
];
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: allowedOrigins as string[],
        credentials: true,
    }),
);

//routes
app.use("/customer", customerRouter);
app.use("/coupon", couponRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);

app.use(globalErrorHandler);

export default app;
