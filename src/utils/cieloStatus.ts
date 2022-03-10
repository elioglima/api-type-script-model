import { PaymentStatus } from '../enum';

export const cieloStatusConverter = (cieloStatus: number) => {
    const paidStatus = [1, 2];
    const refusedStatus = [3];
    const refundedStatus = [10, 11];
    const canceledStatus = [13];

    if (paidStatus.includes(cieloStatus))
        return PaymentStatus.PAID;
    else if (refusedStatus.includes(cieloStatus))
        return PaymentStatus.REFUSED;
    else if (refundedStatus.includes(cieloStatus))
        return PaymentStatus.REFUNDED;
    else if (canceledStatus.includes(cieloStatus))
        return PaymentStatus.CANCELED;
    else return PaymentStatus.ERROR;
};
