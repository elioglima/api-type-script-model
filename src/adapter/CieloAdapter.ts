import { IAdapter, reqCardAdd, reqCardFind, reqCardRemove, reqMakePayment, reqRepayPayment, resCardAdd, resCardFind, resCardRemove, resMakePayment, resRepayPayment } from '../domain/IAdapter';

export class CieloAdapter implements IAdapter {

    readonly API_URL = 'cielo.com';
    readURL(): string | undefined {
        throw new Error('Method not implemented.');
    }

    request(method: 'POST' | 'GET' | 'PUT') {
        switch (method) {
            case 'POST':

                break;

            case 'GET':

                break;

            case 'PUT':

                break;

            default:
                throw new Error('Method not implemented.');
        }
    }

    cardAdd(payload: reqCardAdd): resCardAdd {
        throw new Error('Method not implemented.');
    }

    cardRemove(payload: reqCardRemove): resCardRemove {
        throw new Error('Method not implemented.');
    }

    cardFind(payload: reqCardFind): resCardFind {
        throw new Error('Method not implemented.');
    }

    makePayment(payload: reqMakePayment): resMakePayment {
        throw new Error('Method not implemented.');
    }

    repayPayment(payload: reqRepayPayment): resRepayPayment {
        throw new Error('Method not implemented.');
    }


}
