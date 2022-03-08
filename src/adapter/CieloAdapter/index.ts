/*

    INTEGRACAO DE PAGAMENTOS - CIELO

    https://developercielo.github.io/manual/cielo-ecommerce#tokeniza%C3%A7%C3%A3o-de-cart%C3%B5es

*/

import {
    TErrorGeneric,
    TCieloTransactionInterface,
    reqCardAdd,
    reqCardFind,
    reqCardRemove,
    reqMakePayment,
    resCardAdd,
    resCardFind,
    resCardRemove,
    resMakePayment,
} from '../../domain/IAdapter';

import {
    reqRecurrentCreate,
    resRecurrentCreate,
    reqRecurrentPaymentConsult,
    resRecurrentPaymentConsult,
    reqRecurrentDeactivate,
    resRecurrentDeactivate,
    reqRecurrentReactivate,
    resRecurrentReactivate

} from '../../domain/RecurrentPayment';

import {
    reqFindPayment,
    resFindPayment,
} from '../../domain/Payment';

import { Utils } from '../../utils/utils';
import { ICardAdapter } from './ICardAdapter';
import { RecurentMethods } from './recurrent/index';
import { PaymentsMethods } from './payment/index';

export class CieloAdapter implements ICardAdapter {
    private util: Utils | undefined;
    private recurentMethods: RecurentMethods;
    private paymentsMethods: PaymentsMethods;


    constructor(transactionConfig: TCieloTransactionInterface) {
        this.util = new Utils(transactionConfig);
        this.recurentMethods = new RecurentMethods(transactionConfig)
        this.paymentsMethods = new PaymentsMethods(transactionConfig)

    }

    private error(message: string): Promise<TErrorGeneric> {
        return new Promise<TErrorGeneric>((resolve) => resolve({
            error: true,
            message: message || 'this.util not started'
        }))
    }


    // manipulando cartoes 
    public cardAdd(payload: reqCardAdd): Promise<resCardAdd | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')
        return this.util.post<resCardAdd, reqCardAdd | TErrorGeneric>(
            { path: '/1/card/' },
            payload,
        );
    }

    public cardRemove(_payload: reqCardRemove): resCardRemove | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented.');
    }

    public cardFind(_payload: reqCardFind): resCardFind | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented.');
    }



    // manipulando e efetuando pagamentos
    public makePayment(transaction: reqMakePayment): Promise<resMakePayment | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')

        if (!transaction?.payment?.creditCard?.cardToken)
            return this.error('card identifier not found : (cardToken)')

        return this.util.postToSales<resMakePayment, reqMakePayment>(
            transaction,
        );
    }

    public find(payload: reqFindPayment): Promise<resFindPayment | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')
        return this.paymentsMethods.Find(payload)
    }


    // manipulando e efetuando pagamentos recorrentes
    public recurrentCreate(payload: reqRecurrentCreate): Promise<resRecurrentCreate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')
        return this.recurentMethods.Create(payload)
    }

    public recurrentFind(payload: reqRecurrentPaymentConsult): Promise<resRecurrentPaymentConsult | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')
        return this.recurentMethods.Find(payload)
    }

    public recurrentDeactivate(payload: reqRecurrentDeactivate): Promise<resRecurrentDeactivate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')
        return this.recurentMethods.Deactivate(payload)
    }

    public recurrentReactivate(payload: reqRecurrentReactivate): Promise<resRecurrentReactivate | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')
        return this.recurentMethods.Reactivate(payload)
    }



}

