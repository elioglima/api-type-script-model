import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';
import { EnumInvoiceStatus } from './EnumInvoiceStatus';

export type TStatusInvoiceData = {
    invoiceId: number;
    description: string;
    paidAt: Date; // timestamp
    paymentMethod: EnumInvoicePaymentMethod;
    amountOfDailure: number;
    statusInvoice: EnumInvoiceStatus;
};
