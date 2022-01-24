import { CieloTransactionInterface } from 'src/interface/cielo-transaction.interface';
import {
    IAdapter,
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

/*
    https://developercielo.github.io/manual/cielo-ecommerce#tokeniza%C3%A7%C3%A3o-de-cart%C3%B5es
*/

export class CieloAdapter implements IAdapter {
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

    public cardRemove(payload: reqCardRemove): resCardRemove {
        throw new Error('Method not implemented.');
    }

    public cardFind(payload: reqCardFind): resCardFind {
        throw new Error('Method not implemented.');
    }

    public makePayment(payload: reqMakePayment): resMakePayment {
        throw new Error('Method not implemented.');
    }

    public repayPayment(payload: reqRepayPayment): resRepayPayment {
        throw new Error('Method not implemented.');
    }

    private _request(method: 'POST' | 'GET' | 'PUT') {
        switch (method) {
            case 'POST':
                throw new Error('Method not implemented.');
                break;

            case 'GET':
                throw new Error('Method not implemented.');
                break;

            case 'PUT':
                throw new Error('Method not implemented.');
                break;

            default:
                throw new Error('Method not implemented.');
        }
    }
}
