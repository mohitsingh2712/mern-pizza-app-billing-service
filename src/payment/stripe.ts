import Stripe from "stripe";
import {
    CustomMetaData,
    PaymentGW,
    PaymentOptions,
    PaymentSession,
    VerifiedSession,
} from "./paymentTypes";
import config from "config";

export class StripeGW implements PaymentGW {
    private stripe: Stripe;
    private frontendUrl;
    constructor() {
        this.stripe = new Stripe(config.get("stripe.secretKey"));
        this.frontendUrl =
            String(config.get("frontend.client")) || "http://localhost:3000";
    }
    async createSession(options: PaymentOptions): Promise<PaymentSession> {
        const session = await this.stripe.checkout.sessions.create(
            {
                billing_address_collection: "required",
                metadata: {
                    orderId: options.orderId,
                },
                line_items: [
                    {
                        price_data: {
                            unit_amount: options.amount * 100,
                            product_data: {
                                name: "online pizza order",
                                description: "Amount to be paid",
                                images: ["https://placehold.jp/150x150.png"],
                            },
                            currency: options.currency || "inr",
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${this.frontendUrl}/payment?success=true&orderId=${options.orderId}`,
                cancel_url: `${this.frontendUrl}/payment?success=false&orderId=${options.orderId}`,
            },
            { idempotencyKey: options.idempotentKey },
        );
        return {
            id: session.id,
            paymentUrl: session.url,
            paymentStatus: session.payment_status,
        };
    }
    async getSession(id: string) {
        const session = await this.stripe.checkout.sessions.retrieve(id);
        const verifiedSession: VerifiedSession = {
            id: session.id,
            metaData: session.metadata as unknown as CustomMetaData,
            paymentStatus: session.payment_status,
        };
        return verifiedSession;
    }
}
