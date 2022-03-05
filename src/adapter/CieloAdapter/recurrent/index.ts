import {
    reqRecurrentCreate,
    resRecurrentCreate,
    reqRecurrentPaymentConsult,
    resRecurrentPaymentConsult
} from '../../../domain/RecurrentPayment'

import {
    TErrorGeneric,
    TCieloTransactionInterface
} from '../../../domain/IAdapter';

import { Utils } from '../../../utils/utils';


export class RecurentMethods {
    private util: Utils | undefined;

    constructor(transactionConfig: TCieloTransactionInterface) {
        this.util = new Utils(transactionConfig);
    }

    private error(message: string): Promise<TErrorGeneric> {
        return new Promise<TErrorGeneric>((resolve) => resolve({
            error: true,
            message: message || 'this.util not started'
        }))
    }

    public Create(payload: reqRecurrentCreate): Promise<resRecurrentCreate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')

        // criando uma recorrencia agendada
        return this.util.post<resRecurrentCreate | TErrorGeneric, reqRecurrentCreate>(
            { path: '/1/sales/' },
            payload,
        );
    }

    public Find(payload: reqRecurrentPaymentConsult): Promise<resRecurrentPaymentConsult | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')

        if (!payload.RecurrentPaymentId)
            return this.error('RecurrentPaymentId was not informed.')

        // consultando uma recorrencia
        return this.util.get<resRecurrentPaymentConsult | TErrorGeneric>(
            { path: `/1/sales/${payload.RecurrentPaymentId}` }
        );
    }

}