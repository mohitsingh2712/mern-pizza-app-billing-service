import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";
import customerRouter from "./customer/customerRouter";

const app = express();

//routes
app.use("/customer", customerRouter);

app.use(globalErrorHandler);

export default app;
