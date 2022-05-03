export interface PaymentRecurrence {
    id?: number;
    active?: boolean;
    residentId: number;
    value: number;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    payCardNumber?: string;
    payCardHolder?: string;
    payCardExpirationDate?: string;
    payCardSaveCard?: boolean;
    payCardBrand?: string;

    recurrentPaymentId?: string;
    reasonCode?: number;
    reasonMessage?: string;
    nextRecurrency?: Date;
    interval?: number;
    linkRecurrentPayment?: string;
    authorizeNow?: boolean;
}

export type refundRecurrencePayment = {
    invoiceId: Number,
    reason: string
}