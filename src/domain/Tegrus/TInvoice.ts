import { EnumTopicStatusInvoice } from './TStatusInvoice';
import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';
import { EnumInvoiceType } from './EnumInvoiceType';

export type TInvoice = {
    id?: number;
    resident: number;
    invoiceId: number;
    apartmentId: number;
    residentId: number;
    recurrenceId?: string;
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
    referenceDate: Date; //timestamp,
    startDateRecurrence: Date; //timestamp,
    isSpot?: boolean;
    active?: boolean;
    type: EnumInvoiceType;
    paymentMethod: EnumInvoicePaymentMethod;
    statusInvoice: EnumTopicStatusInvoice;
};

export type TInvoiceFilter = {
    startDate: string; // 01/02/2022 00:00
    endDate: string; // 01/02/2022 23:59
    invoiceId?: number;
    residentId?: number;
    userId?: number;
    paymentMethod?: EnumInvoicePaymentMethod;
    statusInvoice?: EnumTopicStatusInvoice;
};

export type TLinkInvoice = {
    invoiceId: number;
    hashCredit: string;
};
