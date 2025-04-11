import { Request, Response } from "express";
import { PaymentGW } from "./paymentTypes";
import { OrderService } from "../order/orderService";
import { PaymentStatusEnum } from "../order/orderTypes";
import { MessageBroker } from "../types/broker";

export class PaymentController {
    constructor(
        private paymentGw: PaymentGW,
        private orderService: OrderService,
        private broker: MessageBroker,
    ) {}
    async handleWebhook(req: Request, res: Response) {
        const webhookBody = req.body as Record<string, unknown>;
        if (webhookBody.type === "checkout.session.completed") {
            const data = webhookBody.data as { object: { id: string } };
            const verifiedSession = await this.paymentGw.getSession(
                data.object.id,
            );
            const isPaymentSuccess =
                verifiedSession.paymentStatus === "paid" ||
                verifiedSession.paymentStatus === "no_payment_required";
            const updateOrder =
                await this.orderService.updateOrderPaymentStatus(
                    verifiedSession.metaData.orderId,
                    isPaymentSuccess
                        ? PaymentStatusEnum.PAID
                        : PaymentStatusEnum.FAILED,
                );

            return res.status(200).json({
                message: "Payment status updated",
                data: updateOrder,
            });
        }
        await this.broker.sendMessage("billing", JSON.stringify(webhookBody));
        res.status(200).json({
            message: "Webhook received",
        });
    }
}
