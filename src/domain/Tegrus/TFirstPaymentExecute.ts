import { EnumBrands } from '../../enum/BrandsEnum';
import { TStatusInvoice } from './TStatusInvoice';


export type TFirstPaymentExecReq = {
    hash: string,
    card: {
        cardNumber: string,
        brand: EnumBrands,
        customerName: string,
        expirationDate: string,
        holder: string,
    }
}

export type TStatusRecurrency = {
    invoiceId: number;
    description?: string;
    paidAt: Date;
    paymentMethod: EnumPayMethod;
    amountOfFailure?: number;
    statusInvoice: TStatusInvoice;
}

export enum EnumPayMethod {
    TICKET = 'ticket',
    TRANSFER = 'transfer',
    CREDIT = 'credit',
    INTER_TRANS = 'international_transfer',
    COURTESY = 'courtesy'
}
