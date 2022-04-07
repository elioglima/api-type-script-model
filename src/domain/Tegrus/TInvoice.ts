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
    condominium: number; // double,
    discount: number; // double,
    tax: number; // double,
    refund: number; // double,
    fine: number; // double,
    fineTicket?: number;
    dueDate: Date; //timestamp,
    description: string;
    anticipation: boolean;
    referenceDate: Date; //timestamp,
    active?: boolean;
    type: EnumInvoiceType;
    paymentMethod: EnumInvoicePaymentMethod;
    statusInvoice: EnumInvoiceStatus;
    isRecurrence: boolean;
    resident: TResident;
    residentIdenty?: number;
    recurrenceId?: number;
    paymentDate?: Date;
    returnMessage?: string;
    paymentId?: string;
    tid?: string;
    returnCode?: string;
    isExpired?: boolean;
    atUpdate?: boolean;
    referenceCode?: number;
};

export type TInvoiceFilter = {
    startDate: string; // 01/02/2022 00:00
    endDate: string; // 01/02/2022 23:59
    invoiceId?: number;
    residentId?: number;
    userId?: number;
    paymentMethod?: EnumInvoicePaymentMethod;
    statusInvoice?: EnumInvoiceStatus;
};

export type TLinkInvoice = {
    invoiceId?: number;
    hashCredit?: string;
    err?: boolean;
    message?: string;
    data?: any;
};
