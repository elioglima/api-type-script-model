import {
    TransactionCreditCardRequestModel,
    TransactionCreditCardResponseModel,
} from '../domain/Transactions/transactionCreditCard';
import {
    CancelTransactionResponseModel,
    CancelTransactionRequestModel,
} from 'src/domain/Transactions/CancelTransaction';
import { CieloTransactionInterface } from 'src/interface/cielo-transaction.interface';
import { HttpRequestMethodEnum, Utils } from 'src/utils/utils';
import { IHttpRequestOptions } from 'cielo';

export class CreditCard {
    private cieloTransactionParams: CieloTransactionInterface;
    private util: Utils;

    constructor(cieloTransactionParams: CieloTransactionInterface) {
        this.cieloTransactionParams = cieloTransactionParams;
        this.util = new Utils(cieloTransactionParams);
    }

    public transaction(
        transaction: TransactionCreditCardRequestModel,
    ): Promise<TransactionCreditCardResponseModel> {
        return this.util.postToSales<
            TransactionCreditCardResponseModel,
            TransactionCreditCardRequestModel
        >(transaction);
    }

    public cancelTransaction(
        cancelTransactionRequest: CancelTransactionRequestModel,
    ): Promise<CancelTransactionResponseModel> {
        const amount = cancelTransactionRequest.amount
            ? `?amount=${cancelTransactionRequest.amount}`
            : '';
        const path = cancelTransactionRequest.paymentId
            ? `/1/sales/${cancelTransactionRequest.paymentId}/void${amount}`
            : `/1/sales/OderId/${cancelTransactionRequest.merchantOrderId}/void${amount}`;
        const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
            method: HttpRequestMethodEnum.PUT,
            path: path,
            hostname: this.cieloTransactionParams.hostnameTransacao,
        });

        return this.util.request<CancelTransactionResponseModel>(options, {});
    }
}
