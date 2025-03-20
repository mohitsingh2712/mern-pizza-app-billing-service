import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import customerRouter from "./customer/customerRouter";
import couponRouter from "./coupon/couponRouter";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/customer", customerRouter);
app.use("/coupon", couponRouter);

app.use(globalErrorHandler);

export default app;
