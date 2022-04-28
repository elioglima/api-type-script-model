import { EnumInvoiceStatus } from './EnumInvoiceStatus';
import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';
import { EnumInvoiceType } from './EnumInvoiceType';
import { TResident } from './TResident';

export type TInvoice = {
    id?: number;
    date?: Date;
    invoiceId: number;
    userId?: number;
    apartmentId: number;
    enterpriseId: number;
    value: number; // double,
    totalValue: number; // double,
    condominium: number; // double,
    discount: number; // double,
    tax: number; // double,
    stepValue: number; // double,
    commission: number; // double,
    refund: number; // double,
    expense: number; // double,
    fine: number; // double,
    fineTicket?: number;
    dueDate: Date; //timestamp,
    description: string;
    anticipation: boolean;
    referenceDate: Date; //timestamp,
    recurrenceDate: Date; //timestamp,
    active?: boolean;
    type: EnumInvoiceType;
    paymentMethod: EnumInvoicePaymentMethod;
    statusInvoice: EnumInvoiceStatus;
    isRecurrence: boolean;
    residentIdenty?: any;
    // recurrenceId?: number;
    paymentDate?: Date;
    returnMessage?: string;
    paymentId?: string;
    tid?: string;
    returnCode?: string;
    isExpired?: boolean;
    atUpdate?: boolean;
    referenceCode?: number;
    resident: TResident;
    residentId?: number;
    tryNumber?: number;
    startReferenceDate: Date;
    endReferenceDate: Date;
};

export type TInvoiceFilter = {
    startDate: string; // 01/02/2022 00:00
    endDate: string; // 01/02/2022 23:59
    invoiceId?: number;
    residentId?: number;
    userId?: number;
    paymentMethod?: EnumInvoicePaymentMethod;
    statusInvoice?: EnumInvoiceStatus;
    active?: boolean;
    type?: EnumTypeInvoice;
};

export const enum EnumTypeInvoice {
    rent = 'rent',
    booking = 'booking',
}

export type TLinkInvoice = {
    invoiceId?: number;
    hashCredit?: string;
    err?: boolean;
    message?: string;
    data?: any;
};
