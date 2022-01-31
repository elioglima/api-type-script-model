import {
    ConsultTokenRequestModel,
    ConsultTokenResponseModel,
} from 'src/domain/Card/consultToken';
import {
    ConsultBinRequestModel,
    ConsultBinResponseModel,
} from 'src/domain/Consults/consultBin';
import { ConsultTransactionRecurrentPaymentIdRequestModel } from 'src/domain/Consults/consultTrasactions';
import { RecurrentPaymentConsultResponseModel } from 'src/domain/RecurrentPayment/recurrentPaymentConsult';
import {
    ConsultMerchantOrderIdResponseModel,
    ConsultTransactionMerchantOrderIdRequestModel,
    ConsultTransactionPaymentIdRequestModel,
} from 'src/domain/Transactions/ConsultTransaction';
import { TransactionCreditCardResponseModel } from 'src/domain/Transactions/transactionCreditCard';
import { Utils } from 'src/utils/utils';
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';

export class Consult {
    private cieloTransactionParams: CieloTransactionInterface;
    private util: Utils;

    constructor(transaction: CieloTransactionInterface) {
        this.cieloTransactionParams = transaction;
        this.util = new Utils(transaction);
    }

    public paymentId(
        params: ConsultTransactionPaymentIdRequestModel,
    ): Promise<TransactionCreditCardResponseModel> {
        const options = {
            path: `/1/sales/${params.paymentId}`,
        };

        return this.util.get<TransactionCreditCardResponseModel>(options);
    }

    public merchantOrderId(
        params: ConsultTransactionMerchantOrderIdRequestModel,
    ): Promise<ConsultMerchantOrderIdResponseModel> {
        const options = {
            path: `/1/sales?merchantOrderId=${params.merchantOrderId}`,
        };

        return this.util.get<ConsultMerchantOrderIdResponseModel>(options);
    }

    public recurrent(
        params: ConsultTransactionRecurrentPaymentIdRequestModel,
    ): Promise<RecurrentPaymentConsultResponseModel> {
        const options = {
            path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
        };

        return this.util.get<RecurrentPaymentConsultResponseModel>(options);
    }

    public bin(
        params: ConsultBinRequestModel,
    ): Promise<ConsultBinResponseModel> {
        const options = {
            path: `/1/cardBin/${params.cardBin}`,
        };

        return this.util.get<ConsultBinResponseModel>(options);
    }

    public cardToken(
        params: ConsultTokenRequestModel,
    ): Promise<ConsultTokenResponseModel> {
        const options = {
            path: `/1/card/${params.cardToken}`,
        };

        return this.util.get<ConsultTokenResponseModel>(options);
    }
}
