// import { Consult, Card, CreditCard, Recurrent } from './CieloAdapter';
import { Card, Consult, CreditCard } from './adapter/CieloAdapter';
import { Recurrent } from './adapter/CieloAdapter/recurrent';
import { CieloTransactionInterface } from './interface/cielo-transaction.interface';
import { FindPaymentConfigService } from './service/FindPaymentConfigService';

export interface CieloConstructor {
    enterpriseId: number;
    debug?: boolean;
    sandbox?: boolean;
    requestId?: string;
}

export class Cielo {
    private merchantId: string | undefined;
    private merchantKey: string | undefined;
    // private debug: boolean;
    private sandbox: boolean | undefined;
    private requestId?: string | undefined;

    public creditCard: CreditCard | undefined;
    public consult: Consult | undefined;
    public card: Card | undefined;

    public recurrent: Recurrent | undefined;
    public recorrencia: Recurrent | undefined;

    public async init(constructor: CieloConstructor) {
        const configService = new FindPaymentConfigService();
        const paymentConfig = await configService.execute(
            constructor.enterpriseId,
        );

        if (paymentConfig instanceof Error) return paymentConfig;

        this.merchantId = paymentConfig.merchantId;
        this.merchantKey = paymentConfig.merchantKey;

        // this.debug = constructor.debug || false;
        this.sandbox = process.env.SANDBOX == 'true';
        this.requestId = constructor.requestId || undefined;

        const [hostnameTransacao, hostnameQuery] = this.getHostnames(
            this.sandbox,
        );
        const cieloTransactionInterface: CieloTransactionInterface = {
            hostnameTransacao,
            hostnameQuery,
            merchantId: String(this.merchantId),
            merchantKey: String(this.merchantKey),
            requestId: this.requestId,
        };

        this.card = new Card(cieloTransactionInterface);
        this.consult = new Consult(cieloTransactionInterface);
        this.creditCard = new CreditCard(cieloTransactionInterface);
        this.recurrent = new Recurrent(cieloTransactionInterface);

        this.recorrencia = this.recurrent;
    }

    public getConsult() {
        return this.consult;
    }

    public getCreditCard() {
        return this.creditCard;
    }

    private getHostnames(sandbox: boolean): Array<string> {
        if (sandbox) {
            return [
                'apisandbox.cieloecommerce.cielo.com.br',
                'apiquerysandbox.cieloecommerce.cielo.com.br',
            ];
        } else {
            return [
                'api.cieloecommerce.cielo.com.br',
                'apiquery.cieloecommerce.cielo.com.br',
            ];
        }
    }
}
