import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';
import { EnumInvoiceType } from './EnumInvoiceType';

export type TExternalPayment = {
    invoiceId: number;
    description: string;
    paiAt: Date;
    paymentMethod: EnumInvoicePaymentMethod;
    statusInvoice: EnumInvoiceType;
};
