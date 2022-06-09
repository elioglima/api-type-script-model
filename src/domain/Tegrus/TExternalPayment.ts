import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';
import { EnumInvoiceType } from './EnumInvoiceType';

export type TExternalPayment = {
    invoiceId: number;
    description: string;
    paidAt: Date;
    paymentMethod: EnumInvoicePaymentMethod;
    statusInvoice: EnumInvoiceType;
};
