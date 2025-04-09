export interface PaymentOptions {
    currency?: "inr";
    amount: number;
    orderId: string;
    tenantId: string;
    idempotentKey: string;
}
type GatewayPaymentStatus = "no_payment_required" | "paid" | "unpaid";
export interface PaymentSession {
    id: string;
    paymentUrl: string | null;
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
    getSession?: (id: string) => Promise<VerifiedSession>;
}
