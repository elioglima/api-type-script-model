import { TMethodPayment } from './TMethodPayment';
import { EnumTopicStatusInvoice } from './TStatusInvoice';

export enum EnumInvoiceType {
    booking = 'booking', // primeiro aluguel
    fine = 'fine', // multa
    rent = 'rent', // aluguel
    spot = 'spot', // pagamento fora do app
}

/*

    O tipo booking é a fatura de reserva (primeiro pagamento)
    O tipo rent são as faturas mensais de aluguel

*/

export enum EnumInvoicePaymentMethod {
    ticket = 'ticket',
    transfer = 'transfer',
    credit = 'credit',
    internationalTransfer = 'international_transfer',
    courtesy = 'courtesy',
}

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
    isSpot?: boolean;
    active?: boolean;
    type: EnumInvoiceType;
    paymentMethod: EnumInvoicePaymentMethod;
    statusInvoice: EnumTopicStatusInvoice;
};
