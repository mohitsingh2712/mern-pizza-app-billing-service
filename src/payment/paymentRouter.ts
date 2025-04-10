import express from "express";
import { asyncWraper } from "../common/utils/asyncWrapper";
import { PaymentController } from "./PaymentController";
import { StripeGW } from "./stripe";
import { OrderService } from "../order/orderService";
const router = express.Router();

const paymentGw = new StripeGW();
const orderService = new OrderService();
const paymentController = new PaymentController(paymentGw, orderService);

router.post(
    "/webhook",
    asyncWraper(paymentController.handleWebhook.bind(paymentController)),
);

export default router;
