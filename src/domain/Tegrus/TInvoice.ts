import { TMethodPayment } from './TMethodPayment';
import { TStatusInvoice } from './TStatusInvoice';

export type TInvoice = {    
    id?: number;
    resident: number;
    invoiceId: number;
    apartmentId: number;    
    residentId: number;
    enterpriseId: number;
    value: number; // double,
    condominium: number; // double,
    discount: number; // double,
    tax: number; // double,
    refund: number; // double,
    fine: number; // double,
    fineTicket: number;
    startReferenceDate: Date;
    endReferenceDate: Date;
    dueDate: Date; //timestamp,
    description: string;
    anticipation: boolean;
    firstPayment: boolean; // –caso seja a primeira fatura, deve vir preenchido true.
    paymentMethod: TMethodPayment;
    statusInvoice: TStatusInvoice;
    referenceDate: Date; //timestamp,
    isSpot?: boolean;
    active?: boolean;
};
