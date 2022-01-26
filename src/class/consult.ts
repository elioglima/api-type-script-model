import {
    ConsultTokenRequestModel,
    ConsultTokenResponseModel,
} from 'src/domain/Card/consultToken';
import { Utils } from 'src/utils/utils';
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';

export class Consult {
    private cieloTransactionParams: CieloTransactionInterface;
    private util: Utils;

    constructor(transaction: CieloTransactionInterface) {
        this.cieloTransactionParams = transaction;
        this.util = new Utils(transaction);
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
