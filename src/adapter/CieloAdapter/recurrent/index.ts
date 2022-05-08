import {
    resRecurrentCreate,
    reqRecurrentCreate,
    reqRecurrentPaymentConsult,
    resRecurrentPaymentConsult,
    reqRecurrentDeactivate,
    resRecurrentDeactivate,
    reqRecurrentReactivate,
    resRecurrentReactivate,
    resRecurrentModify,
    reqRecurrenceModify,
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

    public async Find(payload: reqRecurrentPaymentConsult) {
        if (!this.util) return this.error('this.util not started');
        if (!payload.recurrentPaymentId)
            return this.error('recurrenceId was not informed.');

        // consultando uma recorrencia
        return await this.util.get<resRecurrentPaymentConsult | TErrorGeneric>({
            path: `/1/RecurrentPayment/${payload.recurrentPaymentId}`,
            notContentType: true,
        });
    }

    public async Deactivate(
        payload: reqRecurrentDeactivate,
    ): Promise<resRecurrentDeactivate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started');

        if (!payload?.recurrenceId)
            return this.error('recurrenceId was not informed.');
        try {
            return this.util.put({
                path: `/1/RecurrentPayment/${payload?.recurrenceId}/Deactivate`,
            });
        } catch (error) {
            console.log('Cielo Adapter recurrentDeactivate', error);
            throw new Error('Error Method recurrentDeactivate.');
        }
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

    public Modify(
        payload: reqRecurrenceModify,
    ): Promise<resRecurrentModify | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started');

        if (!payload.paymentId)
            return this.error('paymentId was not informed.');

        return this.util.put(
            { path: `/1/RecurrentPayment/${payload.paymentId}/Payment` },
            payload.modify,
        );
    }
}
