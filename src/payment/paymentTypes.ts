interface PaymentOptions {
    currency?: "inr";
    amount: number;
    orderId: string;
    tenantId: string;
    idempotentKey: string;
}
type GatewayPaymentStatus = "no_payment_required" | "paid" | "unpaid";
interface PaymentSession {
    id: string;
    paymentUrl: string;
    paymentStatus: GatewayPaymentStatus;
}
interface CustomMetaData {
    orderId: string;
}

interface VerifiedSession {
    id: string;
    metaData: CustomMetaData;
    paymentStatus: GatewayPaymentStatus;
}
export interface PaymentGW {
    createSession: (options: PaymentOptions) => Promise<PaymentSession>;
    getSession: (id: string) => Promise<VerifiedSession>;
}
