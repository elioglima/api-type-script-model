/*

    INTEGRACAO DE PAGAMENTOS - CIELO

    https://developercielo.github.io/manual/cielo-ecommerce#tokeniza%C3%A7%C3%A3o-de-cart%C3%B5es

*/

import {
    TErrorGeneric,
    TCieloTransactionInterface,
    TEnterprise,
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

import { Card } from './cards';
import { Consult } from './consult';
import { CreditCard } from './creditCard';

export {
    Card,
    Consult,
    CreditCard
}

export class CieloAdapter implements ICardAdapter {
    readonly API_URL = 'cielo.com';
    private util: Utils | undefined;

    constructor(transactionConfig: TCieloTransactionInterface) {
        this.util = new Utils(transactionConfig);

    }

    public makePayment(transaction: reqMakePayment): Promise<resMakePayment | TErrorGeneric> {
        if (!this.util) {
            return new Promise<TErrorGeneric>((resolve) => resolve({
                error: true,
                message: 'this.util not started'
            }))
        }

        return this.util.postToSales<resMakePayment, reqMakePayment>(
            transaction,
        );
    }

    public readURL(): string | undefined {
        throw new Error('Method not implemented.');
    }

    public cardAdd(payload: reqCardAdd): Promise<resCardAdd | TErrorGeneric> {
        if (!this.util) {
            return new Promise<TErrorGeneric>((resolve) => resolve({
                error: true,
                message: 'this.util not started'
            }))
        }

        return this.util.post<resCardAdd, reqCardAdd | TErrorGeneric>(
            { path: '/1/card' },
            payload,
        );
    }

    public cardRemove(_payload: reqCardRemove): resCardRemove | TErrorGeneric {
        if (!this.util) {
            return new Promise<TErrorGeneric>((resolve) => resolve({
                error: true,
                message: 'this.util not started'
            }))
        }

        throw new Error('Method not implemented.');
    }

    public cardFind(_payload: reqCardFind): resCardFind | TErrorGeneric {
        if (!this.util) {
            return new Promise<TErrorGeneric>((resolve) => resolve({
                error: true,
                message: 'this.util not started'
            }))
        }

        throw new Error('Method not implemented.');
    }



    public repayPayment(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        if (!this.util) {
            return new Promise<TErrorGeneric>((resolve) => resolve({
                error: true,
                message: 'this.util not started'
            }))
        }

        throw new Error('Method not implemented.');
    }
}

