import { Request, Response } from "express";
import { PaymentGW } from "./paymentTypes";
import { OrderService } from "../order/orderService";
import { PaymentStatusEnum } from "../order/orderTypes";
import { MessageBroker } from "../types/broker";
import { OrderEvents } from "../types";
import { CustomerService } from "../customer/customerService";

export class PaymentController {
    constructor(
        private paymentGw: PaymentGW,
        private orderService: OrderService,
        private broker: MessageBroker,
        private customerService: CustomerService,
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
            const updatedOrder =
                await this.orderService.updateOrderPaymentStatus(
                    verifiedSession.metaData.orderId,
                    isPaymentSuccess
                        ? PaymentStatusEnum.PAID
                        : PaymentStatusEnum.FAILED,
                );
            const customer = await this.customerService.getCustomer(
                String(updatedOrder!.customerId),
            );

            const brokerMessage = {
                event_type: OrderEvents.PAYMENT_STATUS_UPDATE,
                data: { ...updatedOrder!.toObject(), customerId: customer },
            };

            await this.broker.sendMessage(
                "billing",
                JSON.stringify(brokerMessage),
                verifiedSession.metaData.orderId,
            );
        }
        return res.status(200).json({
            message: "Webhook received",
        });
    }
}
