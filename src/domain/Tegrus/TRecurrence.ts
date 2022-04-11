import { EnumBrands } from '../../enum/BrandsEnum';
import { EnumInvoiceStatus } from './EnumInvoiceStatus';
import { EnumInvoicePaymentMethod } from './EnumInvoicePaymentMethod';

export interface TRecurrence {
    id?: number;
    preUserId?: number;
    userId?: number;
    residentId?: number;
    recurrenceId?: string;
    value?: number;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    err?: boolean;
    data?: any;
}

export type TRecurrenceCard = {
    cardNumber: string;
    brand: EnumBrands;
    customerName: string;
    expirationDate: string;
    holder: string;
    securityCode: number;
};

export type TRecurrenceSchedule = {
    startDateContract: Date;
    endDateContract: Date;
};

export interface TRecurrencePayment {
    id?: number;
    active?: boolean;
    residentId: number;
    value: number;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    payCardNumber?: string;
    payCardHolder?: string;
    payCardExpirationDate?: string;
    payCardSaveCard?: boolean;
    payCardBrand?: string;

    recurrentPaymentId?: string;
    reasonCode?: number;
    reasonMessage?: string;
    nextRecurrency?: Date;
    interval?: number;
    linkRecurrentPayment?: string;
    authorizeNow?: boolean;
}

export type TRecurrencyStatus = {
    message: string;
    invoiceId: number;
    description?: string;
    paidAt: Date;
    nextRecurrency?: Date;
    paymentMethod: EnumInvoicePaymentMethod;
    amountOfFailure?: number;
    statusInvoice: EnumInvoiceStatus;
};
