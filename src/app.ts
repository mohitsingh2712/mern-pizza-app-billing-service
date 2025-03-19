import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import customerRouter from "./customer/customerRouter";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

//routes
app.use("/customer", customerRouter);

app.use(globalErrorHandler);

export default app;
