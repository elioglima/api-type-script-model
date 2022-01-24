import { request } from 'express';
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

/*
    https://developercielo.github.io/manual/cielo-ecommerce#tokeniza%C3%A7%C3%A3o-de-cart%C3%B5es
*/

export class CieloAdapter implements IAdapter {
    readonly API_URL = 'cielo.com';

    public readURL(): string | undefined {
        throw new Error('Method not implemented.');
    }

    public cardAdd(payload: reqCardAdd): resCardAdd {
        return this.cardAdd.post<reqCardAdd, resCardAdd>(
            { path: '/card' },
            request,
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
