import {
    resRecurrentCreate,
    reqRecurrentCreate,
    reqRecurrentPaymentConsult,
    resRecurrentPaymentConsult,
    reqRecurrentDeactivate,
    resRecurrentDeactivate,
    reqRecurrentReactivate,
    resRecurrentReactivate,
} from '../../../domain/RecurrentPayment';

import {
    TErrorGeneric,
    TCieloTransactionInterface,
} from '../../../domain/IAdapter';

import { Utils } from '../../../utils/utils';

export class RecurentMethods {
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

    public Create(
        payload: reqRecurrentCreate,
    ): Promise<resRecurrentCreate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started');

        // criando uma recorrencia agendada
        return this.util.postToSales<
            resRecurrentCreate | TErrorGeneric,
            reqRecurrentCreate
        >(payload);
    }

    public Find(
        payload: reqRecurrentPaymentConsult,
    ): Promise<resRecurrentPaymentConsult | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started');

        if (!payload.recurrenceId)
            return this.error('recurrenceId was not informed.');

        // consultando uma recorrencia
        return this.util.get<resRecurrentPaymentConsult | TErrorGeneric>({
            path: `/1/sales/${payload.recurrenceId}`,
        });
    }

    public async Deactivate(
        payload: reqRecurrentDeactivate,
    ): Promise<resRecurrentDeactivate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started');

        if (!payload?.recurrenceId)
            return this.error('recurrenceId was not informed.');

        return this.util.put({
            path: `/1/RecurrentPayment/${payload?.recurrenceId}/Deactivate`,
        });
    }

    public Reactivate(
        payload: reqRecurrentReactivate,
    ): Promise<resRecurrentReactivate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started');

        if (!payload.recurrenceId)
            return this.error('recurrenceId was not informed.');

        return this.util.get<resRecurrentReactivate | TErrorGeneric>({
            path: `/1/RecurrentPayment/${payload.recurrenceId}/Reactivate`,
        });
    }
}
