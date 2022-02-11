import { CieloTransactionInterface } from 'src/interface/cielo-transaction.interface';
import {
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
} from '../domain/IAdapter';
import { Utils } from '../utils/utils';
import { ICardAdapter } from './ICardAdapter';

/*
    https://developercielo.github.io/manual/cielo-ecommerce#tokeniza%C3%A7%C3%A3o-de-cart%C3%B5es
*/

export class CieloAdapter implements ICardAdapter {
    readonly API_URL = 'cielo.com';
    private util: Utils;
    private cieloTransactionParams: CieloTransactionInterface;

    constructor(transaction: CieloTransactionInterface) {
        this.cieloTransactionParams = transaction;
        this.util = new Utils(this.cieloTransactionParams);
    }

    public readURL(): string | undefined {
        throw new Error('Method not implemented.');
    }

    public cardAdd(payload: reqCardAdd): Promise<resCardAdd> {
        return this.util.post<resCardAdd, reqCardAdd>(
            { path: '/1/card' },
            payload,
        );
    }

    public cardRemove(_payload: reqCardRemove): resCardRemove {
        throw new Error('Method not implemented.');
    }

    public cardFind(_payload: reqCardFind): resCardFind {
        throw new Error('Method not implemented.');
    }

    public makePayment(transaction: reqMakePayment): Promise<resMakePayment> {
        return this.util.postToSales<resMakePayment, reqMakePayment>(
            transaction,
        );
    }

    public repayPayment(_payload: reqRepayPayment): resRepayPayment {
        throw new Error('Method not implemented.');
    }
}
