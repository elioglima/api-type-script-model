import { CieloAdapter } from 'src/adapter/CieloAdapter';
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
} from './IAdapter';

export class Payment implements IAdapter {
    paymentProvider: CieloAdapter;
    API_URL: string | undefined;

    constructor(provider: 'CIELO') {
        const cieloTransactionInterface: CieloTransactionInterface = {
            hostnameTransacao: '',
            hostnameQuery: '',
            merchantId: '',
            merchantKey: '',
            requestId: '',
        };
        switch (provider) {
            case 'CIELO':
                this.paymentProvider = new CieloAdapter(
                    cieloTransactionInterface,
                );
                break;

            default:
                throw new Error('Provider payment not found!');
        }
    }

    readURL(): string | undefined {
        return this.API_URL;
    }

    public cardAdd(payload: reqCardAdd): resCardAdd {
        try {
            return this.paymentProvider.cardAdd(payload);
        } catch (error) {
            throw new Error('Error Method cardAdd.');
        }
    }

    cardRemove(payload: reqCardRemove): resCardRemove {
        try {
            return this.paymentProvider.cardRemove(payload);
        } catch (error) {
            throw new Error('Error Method cardRemove.');
        }
    }

    cardFind(payload: reqCardFind): resCardFind {
        try {
            return this.paymentProvider.cardFind(payload);
        } catch (error) {
            throw new Error('Error Method cardRemove.');
        }
    }

    makePayment(payload: reqMakePayment): resMakePayment {
        try {
            return this.paymentProvider.makePayment(payload);
        } catch (error) {
            throw new Error('Error Method cardRemove.');
        }
    }

    repayPayment(payload: reqRepayPayment): resRepayPayment {
        try {
            return this.paymentProvider.repayPayment(payload);
        } catch (error) {
            throw new Error('Error Method repayPayment.');
        }
    }
}

export default Payment;
