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
    reqRepayPayment,
    resCardAdd,
    resCardFind,
    resCardRemove,
    resMakePayment,
    resRepayPayment,
} from '../../domain/IAdapter';

import { Utils } from '../../utils/utils';
import { ICardAdapter } from './ICardAdapter';

export class CieloAdapter implements ICardAdapter {
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

    public makePayment(transaction: reqMakePayment): Promise<resMakePayment | TErrorGeneric> {
        if (!this.util) return this.error('this.util not started')

        if (!transaction?.payment?.creditCard?.cardToken)
            return this.error('card identifier not found : (cardToken)')

        return this.util.postToSales<resMakePayment, reqMakePayment>(
            transaction,
        );
    }

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

    public repayPayment(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented.');
    }


    public recurrentPaymentCustomer(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented. (recurrentPaymentCustomer)');
    }

    public recurrentPaymentEndDate(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented. (recurrentPaymentEndDate)');
    }

    public recurrentPaymentInterval(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented. (recurrentPaymentInterval)');
    }

    public recurrentPaymentRecurrencyDay(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented. (recurrentPaymentRecurrencyDay)');
    }

    public recurrentPaymentAmount(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented. (recurrentPaymentAmount)');
    }

    public recurrentPaymentPayment(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented. (recurrentPaymentPayment)');
    }

    public recurrentPaymentReactivate(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) return this.error('this.util not started')
        throw new Error('Method not implemented. (recurrentPaymentReactivate)');
    }
}

