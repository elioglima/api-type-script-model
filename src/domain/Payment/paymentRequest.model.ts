import { EnumPaymentInterest } from '../../enum/PaymentInterestEnum';
import { EnumCardType } from '../../enum/CardEnum';
import { CreditCardModel } from '../CreditCard';
import { RecurrentPaymentModel } from '../RecurrentPayment';
import { FraudAnalysisModel } from '../FraudAnalysis/fraud-analysis.model';

export interface PaymentRequestModel {
    currency?: string;
    country?: string;
    serviceTaxAmount?: number;
    installments: number;
    interest?: EnumPaymentInterest;
    /**
     * Booleano que identifica que a autorização deve ser com captura automática.
     */
    capture?: boolean;
    /**
     * Define se o comprador será direcionado ao Banco emissor para autenticação do cartão
     */
    authenticate?: boolean;
    /**
     * Texto impresso na fatura bancaria comprador - Exclusivo para VISA/MASTER - não permite caracteres especiais - Ver Anexo
     */
    softDescriptor?: string;
    /**
     * Dados do cartão
     */
    creditCard: CreditCardModel;
    isCryptoCurrencyNegotiation?: boolean;
    /**
     * Tipo do Meio de Pagamento.
     */
    type: EnumCardType;
    amount: number;
    provider?: string;
    /**
     * URI para onde o usuário será redirecionado após o fim do pagamento
     */
    returnUrl?: string;
    /**
     * Informações de recorrência de pagamento
     */
    recurrentPayment?: RecurrentPaymentModel;
    [x: string]: any;

    /**
     * Informações para análise de fraude contratada direto com a Cielo
     */
    fraudAnalysis?: FraudAnalysisModel;
}
