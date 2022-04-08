import { CieloAdapter } from '../adapter/CieloAdapter';

import {
    TErrorGeneric,
    IAdapter,
    reqCardAdd,
    reqCardFind,
    reqCardRemove,
    reqMakePayment,
    resCardAdd,
    resCardFind,
    resCardRemove,
    reqRefoundPayment,
    resRefoundPayment,
} from './IAdapter';

import { FindPaymentConfigService } from '../service/FindPaymentConfigService';
import {
    reqRecurrentCreate,
    reqRecurrentDeactivate,
    resRecurrentCreate,
    resRecurrentDeactivate,
} from './RecurrentPayment';
import { rError, rSuccess } from '../utils';

export class AdapterPayment implements IAdapter {
    API_URL: string | undefined;
    private FindPaymentConfigService = new FindPaymentConfigService();
    private paymentProvider: CieloAdapter | undefined;

    constructor() {}

    public async init(enterpriseId: number) {
        try {
            const paymentConfig: any =
                await this.FindPaymentConfigService.execute(enterpriseId);

            if (paymentConfig instanceof Error) {
                return rError({ message: paymentConfig.message });
            }

            switch (paymentConfig.provider) {
                case 'CIELO':
                    this.paymentProvider = new CieloAdapter(paymentConfig);
                    break;

                default:
                    throw new Error('Provider payment not found!');
            }

            return rSuccess({ message: 'provider successfully located' });
        } catch (error: any) {
            console.log(error);

            return rError({ message: error?.message });
        }
    }

    readURL(): string | undefined {
        return this.API_URL;
    }

    public cardAdd(payload: reqCardAdd): Promise<resCardAdd | TErrorGeneric> {
        if (!this.paymentProvider) throw new Error('Error provider not found.');

        try {
            return this.paymentProvider.cardAdd(payload);
        } catch (error) {
            throw new Error('Error Method cardAdd.');
        }
    }

    public cardRemove(payload: reqCardRemove): resCardRemove {
        if (!this.paymentProvider) throw new Error('Error provider not found.');

        try {
            return this.paymentProvider.cardRemove(payload);
        } catch (error) {
            throw new Error('Error Method cardRemove.');
        }
    }

    public cardFind(payload: reqCardFind): resCardFind {
        if (!this.paymentProvider) throw new Error('Error provider not found.');

        try {
            return this.paymentProvider.cardFind(payload);
        } catch (error) {
            throw new Error('Error Method cardFind.');
        }
    }

    public makePayment(
        payload: reqMakePayment,
    ): Promise<reqMakePayment | TErrorGeneric> {
        if (!this.paymentProvider) throw new Error('Error provider not found.');

        try {
            return this.paymentProvider.makePayment(payload);
        } catch (error) {
            console.log(error);
            throw new Error('Error Method makePayment.');
        }
    }

    public refoundPayment(
        payload: reqRefoundPayment,
    ): Promise<resRefoundPayment | TErrorGeneric> {
        if (!this.paymentProvider) throw new Error('Error provider not found.');

        try {
            return this.paymentProvider.refoundPayment(payload);
        } catch (error) {
            console.log(error);
            throw new Error('Error Method makePayment.');
        }
    }

    public recurrentCreate(
        payload: reqRecurrentCreate,
    ): Promise<resRecurrentCreate | TErrorGeneric> {
        if (!this.paymentProvider) throw new Error('Error provider not found.');
        try {
            return this.paymentProvider.recurrentCreate(payload);
        } catch (error) {
            console.log(error);
            throw new Error('Error Method recurrentDeactivate.');
        }
    }

    public recurrentDeactivate(
        payload: reqRecurrentDeactivate,
    ): Promise<resRecurrentDeactivate | TErrorGeneric> {
        if (!this.paymentProvider) throw new Error('Error provider not found.');
        try {
            return this.paymentProvider.recurrentDeactivate(payload);
        } catch (error) {
            console.log('recurrentDeactivate', error);
            throw new Error('Error Method recurrentDeactivate.');
        }
    }
}

export default AdapterPayment;
