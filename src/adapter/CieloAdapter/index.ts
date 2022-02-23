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

import { FindPaymentConfigService } from '../../service/FindPaymentConfigService';

export {
    Card,
    Consult,
    CreditCard
}


export class CieloAdapter implements ICardAdapter {
    readonly API_URL = 'cielo.com';
    private util: Utils;
    private FindPaymentConfigService = new FindPaymentConfigService();

    constructor(enterprise: TEnterprise) {
        const transaction = this.getEnterpriseData(enterprise);
        this.util = new Utils(transaction);
    }

    public getEnterpriseData(params: TEnterprise) {

        const paymentConfig = this.FindPaymentConfigService.execute(params.id).then(data => {
            console.log(1235, data)
        })
        console.log(123, paymentConfig)

        const cieloTransactionParams: TCieloTransactionInterface = {
            enterpriseProvider: params.provider,
            enterpriseProviderId: params.id,
            hostnameTransacao: '',
            hostnameQuery: '',
            merchantId: '',
            merchantKey: '',
            requestId: '',
            loaded: {
                error: true,
                message: 'not executed'
            }
        }

        try {
            // instance the enterprise data to carry out the transactions
            cieloTransactionParams.hostnameTransacao = ''
            cieloTransactionParams.hostnameQuery = ''
            cieloTransactionParams.merchantId = '82581f4f-0242-4653-8f99-21339e991911'
            cieloTransactionParams.merchantKey = 'OKYBGFFFROOYXUAPPBMQYSCBEFIYWFKQHWVTIFXL'
            cieloTransactionParams.requestId = ''
            cieloTransactionParams.loaded.error = false
            cieloTransactionParams.loaded.message = 'Success'
            return cieloTransactionParams

        } catch (error: any) {
            // results error inside the adapter
            cieloTransactionParams.loaded.error = true
            cieloTransactionParams.loaded.message = error?.message || 'unexpected error'
            return cieloTransactionParams
        }
    }


    public makePayment(transaction: reqMakePayment): Promise<resMakePayment | TErrorGeneric> {
        return this.util.postToSales<resMakePayment, reqMakePayment>(
            transaction,
        );
    }

    public readURL(): string | undefined {
        throw new Error('Method not implemented.');
    }

    public cardAdd(payload: reqCardAdd): Promise<resCardAdd | TErrorGeneric> {
        return this.util.post<resCardAdd, reqCardAdd | TErrorGeneric>(
            { path: '/1/card' },
            payload,
        );
    }

    public cardRemove(_payload: reqCardRemove): resCardRemove | TErrorGeneric {
        throw new Error('Method not implemented.');
    }

    public cardFind(_payload: reqCardFind): resCardFind | TErrorGeneric {
        throw new Error('Method not implemented.');
    }



    public repayPayment(_payload: reqRepayPayment): resRepayPayment | TErrorGeneric {
        throw new Error('Method not implemented.');
    }
}

