import { Link } from '../IAdapter';
import { CreditCardModel } from '../CreditCard/index';

interface customer {
    name: string;
    address?: any
}

interface resPaymentMerchantOrderId {
    paymentId: string;
    receveidDate: Date;
}

interface chargebacksModel {
    amount?: number,
    caseNumber?: number,
    date?: string,
    reasonCode?: number,
    reasonMessage?: string,
    status?: string,
    rawData?: string
}

interface fraudAlertModel {
    date?: string,
    reasonMessage?: string,
    incomingChargeback?: boolean,
}

export interface resPaymentIdPayment {
    serviceTaxAmount?: number;
    installments: number;
    interest?: string;
    capture?: boolean;
    authenticate?: boolean;
    creditCard: CreditCardModel;
    proofOfSale?: string;
    tid?: string;
    authorizationCode?: string;
    chargebacks?: [chargebacksModel]
    fraudAlert?: [fraudAlertModel]
    paymentId?: string;
    type: string;
    amount: number;
    receivedDate: string;
    capturedAmount: number,
    capturedDate: string,
    VoidedAmount: number,
    VoidedDate: string,
    currency?: string;
    country?: string;
    extraDataCollection?: any[];
    status?: number;
    links?: [Link];
}

interface resPaymentId {
    merchantOrderId: string,
    acquirerOrderId: string,
    customer: customer,
    payment: resPaymentIdPayment,
}

export type reqFindPayment = {
    merchantOrderId?: string; // 	Campo Identificador do Pedido na Loja.
    paymentId: string; // Numero de identificação do Pagamento.
}

export type resFindPayment = {
    payment: resPaymentMerchantOrderId | resPaymentId;
}
