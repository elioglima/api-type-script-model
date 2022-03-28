/*
    MerchantId	                            Identificador da loja na API Cielo eCommerce.	Guid	6	Sim
    MerchantKey	                            Chave Publica para Autenticação Dupla na API Cielo eCommerce.	Texto	40	Sim
    RequestId	                            Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT	Guid	36	Não
    MerchantOrderId	                        Numero de identificação do Pedido.	Texto	50	Sim
    Customer.Name	                        Nome do Comprador.	Texto	255	Sim
    Payment.Type	                        Tipo do Meio de Pagamento.	Texto	100	Sim
    Payment.Amount	                        Valor do Pedido (ser enviado em centavos).	Número	15	Sim
    Payment.Installments	                Número de Parcelas.	Número	2	Sim
    Payment.SoftDescriptor	                Texto que será impresso na fatura bancaria do portador - Disponivel apenas para VISA/MASTER - não permite caracteres especiais	Texto	13	Não
    Payment.RecurrentPayment.EndDate	    Data para termino da recorrência.	Texto	10	Não
    Payment.RecurrentPayment.Interval	    Intervalo da recorrência. Monthly (Default)   Bimonthly Quarterly SemiAnnual Annual	Texto	10	Não
    Payment.RecurrentPayment.AuthorizeNow	Booleano para saber se a primeira recorrência já vai ser Autorizada ou não.	Booleano	—	Sim
    CreditCard.CardNumber	                Número do Cartão do Comprador.	Texto	19	Sim
    CreditCard.Holder	                    Nome do Comprador impresso no cartão.	Texto	25	Não
    CreditCard.ExpirationDate	            Data de validade impresso no cartão.	Texto	7	Sim
    CreditCard.SecurityCode	                Código de segurança impresso no verso do cartão.	Texto	4	Não
    CreditCard.Brand	                    Bandeira do cartão.	Texto	10	Sim
*/

import { CreditCardModel } from '../CreditCard/index';
import { Link } from '../IAdapter';


export interface customer {
    name: string;
}

export interface recurrentPayment {
    authorizeNow: boolean,      // true or false
    endDate: Date,            // "2019-12-01",
    interval: string            // "SemiAnnual"
}

export interface recurrentePayment {
    type: string;
    amount: number;
    installments: number;
    softDescriptor: string;
    recurrentPayment: recurrentPayment,
    creditCard: CreditCardModel;
    serviceTaxAmount?: number;
    interest?: string;
    capture?: boolean;
    authenticate?: boolean;
    recurrent?: boolean;
    proofOfSale?: string;
    tid?: string;
    authorizationCode?: string;
    paymentId?: string;
    currency?: string;
    country?: string;
    extraDataCollection?: any[];
    status?: number;
    returnCode?: string;
    returnMessage?: string;
    link?: Link;
    authorizeNow?: boolean;
    links?: [Link];
}


export type reqRecurrentCreate = {
    merchantOrderId: string;
    customer: customer;
    payment: recurrentePayment;
    links?: Link[];
}

export type resRecurrentCreate = {
    merchantOrderId: string;
    customer: customer;
    payment: recurrentePayment;
    links?: Link[];
}


export type reqRecurrentDeactivate = {
   recurrenceId: string;
}