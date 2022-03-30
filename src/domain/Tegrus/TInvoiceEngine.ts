import { TResident } from './TResident';
import { TInvoice } from './TInvoice';
import { TStatusInvoiceData } from './TStatusInvoice';
import { TExternalPayment } from './TExternalPayment';

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
    externalPayment?: TExternalPayment;
    deleteInvoice?: {
        invoiceId: string;
        description: string;
    };
    statusInvoice?: TStatusInvoiceData;
    updateInvoice?: TInvoice;
    cancelContract?: {
        residentId: number;
        description: string;
        unitId: number;
        entrepriseId: number;
        finishDate: Date; //timestamp;
    };
};
