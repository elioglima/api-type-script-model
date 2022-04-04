import { EnumBrands } from '../../enum/BrandsEnum';
import { EnumInvoiceStatus } from './EnumInvoiceStatus';
import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';

export type TFirstPaymentExecReq = {
    hash: string;
    card: {
        cardNumber: string;
        brand: EnumBrands;
        customerName: string;
        expirationDate: string;
        holder: string;
    };
};

export type TStatusRecurrency = {
    invoiceId: number;
    description?: string;
    paidAt: Date;
    paymentMethod: EnumInvoicePaymentMethod;
    amountOfFailure?: number;
    statusInvoice: EnumInvoiceStatus;
};
