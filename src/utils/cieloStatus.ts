import { EnumInvoiceStatus } from '../domain/Tegrus';

export const cieloStatusConverter = (cieloStatus: number) => {
    const paidStatus = [1, 2];
    const refusedStatus = [3];
    const refundedStatus = [10, 11];
    const canceledStatus = [13];

    if (paidStatus.includes(cieloStatus)) return EnumInvoiceStatus.paid;
    else if (refusedStatus.includes(cieloStatus))
        return EnumInvoiceStatus.paymentError;
    else if (refundedStatus.includes(cieloStatus))
        return EnumInvoiceStatus.refunded;
    else if (canceledStatus.includes(cieloStatus))
        return EnumInvoiceStatus.canceled;
    else return EnumInvoiceStatus.paymentError;
};
