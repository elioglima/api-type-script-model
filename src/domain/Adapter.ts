import { CieloAdapter } from 'src/adapter/CieloAdapter';

import {
    TErrorGeneric,
    TEnterprise,
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

    constructor(enterprise: TEnterprise) {
        // faz a seleção das operadoras de pagamento
        switch (enterprise.provider) {
            case 'CIELO':
                this.paymentProvider = new CieloAdapter(enterprise);
                break;

            default:
                throw new Error('Provider payment not found!');
        }
    }

    readURL(): string | undefined {
        return this.API_URL;
    }

    public cardAdd(payload: reqCardAdd): Promise<resCardAdd | TErrorGeneric> {
        try {
            return this.paymentProvider.cardAdd(payload);
        } catch (error) {
            throw new Error('Error Method cardAdd.');
        }
    }

    public cardRemove(payload: reqCardRemove): resCardRemove {
        try {
            return this.paymentProvider.cardRemove(payload);
        } catch (error) {
            throw new Error('Error Method cardRemove.');
        }
    }

    public cardFind(payload: reqCardFind): resCardFind {
        try {
            return this.paymentProvider.cardFind(payload);
        } catch (error) {
            throw new Error('Error Method cardFind.');
        }
    }

    public makePayment(payload: reqMakePayment): Promise<resMakePayment | TErrorGeneric> {
        try {
            return this.paymentProvider.makePayment(payload);
        } catch (error) {
            throw new Error('Error Method makePayment.');
        }
    }

    public repayPayment(payload: reqRepayPayment): resRepayPayment {
        try {
            return this.paymentProvider.repayPayment(payload);
        } catch (error) {
            throw new Error('Error Method repayPayment.');
        }
    }
}

export default Payment;
