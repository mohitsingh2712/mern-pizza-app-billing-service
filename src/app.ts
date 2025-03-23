import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import customerRouter from "./customer/customerRouter";
import couponRouter from "./coupon/couponRouter";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
    }),
);

//routes
app.use("/customer", customerRouter);
app.use("/coupon", couponRouter);

app.use(globalErrorHandler);

export default app;
