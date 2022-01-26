import { CieloTransactionInterface } from 'src/interface/cielo-transaction.interface';
import { Utils } from 'src/utils/utils';

export class CreditCard {
    private cieloTransactionParams: CieloTransactionInterface;
    private util: Utils;

    constructor(cieloTransactionParams: CieloTransactionInterface) {
        this.cieloTransactionParams = cieloTransactionParams;
        this.util = new Utils(cieloTransactionParams);
    }
}
