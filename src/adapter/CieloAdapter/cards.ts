import { Utils } from 'src/utils/utils';
import { CieloTransactionInterface } from 'src/interface/cielo-transaction.interface';
import { reqCardAdd, resCardAdd } from '../../domain/IAdapter';

export class Card {
    private cieloTransactionParams: CieloTransactionInterface;
    private util: Utils;

    constructor(transaction: CieloTransactionInterface) {
        this.cieloTransactionParams = transaction;
        this.util = new Utils(this.cieloTransactionParams);
    }

    public createCardTokenized(request: reqCardAdd): Promise<resCardAdd> {
        return this.util.post<resCardAdd, reqCardAdd>(
            { path: '/1/card' },
            request,
        );
    }
}
