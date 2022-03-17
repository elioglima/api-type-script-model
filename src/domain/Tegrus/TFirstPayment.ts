import { TDOC } from './TDOC';
import { TResident } from './TResident';
import { TInvoice } from './TInvoice';

export type TFirstPayment = {
    externalId: number;
    apartamentId: number;
    enterpriseId: number;
    contractCode: string;
    startDateContract: string;
    endDateContract: string;
    resident: TResident;
    invoice: TInvoice;
};

export type resFirstPaymentCreate = {
    invoice_id: number;
    link_credit?: string;
    link_pix?: string;
    link_boleto?: string;
};

export type reqCreateHash = {
    invoiceId: number;
    //url?: any
};

export type resCreateHash = {
    invoiceId?: number;
    link?: string;
    hash?: string;
    err?: boolean;
    message?: string;
};

export type reqSendLinkResident = {
    invoiceId: number;
    url?: any;
};

export type resSendLinkResident = {
    success: boolean;
    message: string;
    link?: reqSendLinkResident;
};

export interface hashData {
    hash: string;
    link: string;
    nickname: string;
    email: string;
    lifeTime: Date;
    smartphone: string;
    documentType: TDOC;
    document: string;
    invoiceId: Number;
}
