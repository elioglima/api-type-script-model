import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';
export enum TStatusInvoice {
    CANCELADO = 'CANCELED',
    PUBLICADO = 'ISSUED',
    PAGO = 'PAID',
}

export enum EnumTopicStatusInvoice {
    canceled = 'canceled',
    issued = 'issued',
    paid = 'paid',
    paymentError = 'payment_error',
}

export type TStatusInvoiceData = {
    invoiceId: number;
    description: string;
    paidAt: Date; // timestamp
    paymentMethod: EnumInvoicePaymentMethod;
    amountOfDailure: number;
    statusInvoice: TStatusInvoice;
};
