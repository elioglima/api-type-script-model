import { reqFindPayment, resFindPayment } from '../../../domain/Payment';

import {
    TErrorGeneric,
    TCieloTransactionInterface,
} from '../../../domain/IAdapter';

import { Utils } from '../../../utils/utils';

export class PaymentsMethods {
    private util: Utils | undefined;

    constructor(transactionConfig: TCieloTransactionInterface) {
        this.util = new Utils(transactionConfig);
    }

    private error(message: string): Promise<TErrorGeneric> {
        return new Promise<TErrorGeneric>(resolve =>
            resolve({
                err: true,
                message: message || 'this.util not started',
            }),
        );
    }

    public Find(
        payload: reqFindPayment,
    ): Promise<resFindPayment | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started');

        if (!payload.paymentId && !payload.merchantOrderId)
            return this.error('RecurrentPaymentId was not informed.');

        let url = undefined;
        if (!!payload.paymentId) {
            url = `/1/sales/${payload.paymentId}`;
        } else if (!!payload.merchantOrderId) {
            url = `/1/sales?merchantOrderId=${payload.merchantOrderId}`;
        } else return this.error('Find :: unexpected error.');

        return this.util.get<resFindPayment | TErrorGeneric>({ path: url });
    }
}
