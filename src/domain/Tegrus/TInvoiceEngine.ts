import { TResident } from './TResident';
import { TInvoice } from './TInvoice';
import { TMethodPayment } from './TMethodPayment';

export enum TStatusInvoice {
    PAYMENT_PROBLEM = 'PROBLEMA NO PAGAMENTO',
    PAID = 'PAGO',
}

export type TInvoiceEngineReq = {
    createResident?: {
        externalId: number;
        apartmentId: number;
        enterpriseId: number;
        contractCode: string;
        startDateContract: Date; // timestamp
        endDateContract: Date; // timestamp
        resident: TResident;
        invoice: TInvoice;
    };
    createInvoice?: TInvoice;
    deleteInvoice?: {
        invoiceId: string;
        description: string;
    };
    statusInvoice?: {
        invoiceId: number;
        description: string;
        paidAt: Date; // timestamp
        paymentMethod: TMethodPayment;
        amountOfDailure: number;
        statusInvoice: TStatusInvoice;
    };
    updateInvoice?: TInvoice;
};
