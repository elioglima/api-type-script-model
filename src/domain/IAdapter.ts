import { EnumBrands } from '../enum/BrandsEnum';
import { CustomerModel } from './Customer/customer.model';
import { PaymentRequestModel } from './Payment/paymentRequest.model';

export interface Link {
    Method: string;
    Rel: string;
    Href: string;
}

export type typePaymentCredentials = {
    merchantId: string;
    merchantKey: string;
};


export type TEnterprise = {
    provider: string;
    id: number;
}


export type TErrorGeneric = {
    message: string;
    error?: boolean;
    name?: string;
    stack?: string;
    data?: any;
}

export type TLoaded = {
    error: boolean;
    message: string;
}


export type TCieloTransactionInterface = {
    provider: string;
    enterpriseId: number;
    hostnameTransacao: string;
    hostnameQuery?: string;
    merchantId: string;
    merchantKey: string;
    requestId?: string;
    loaded?: TLoaded;
}

// Add new Card Req and Response
export type reqCardAdd = {
    customerName: string;
    cardNumber: string;
    holder: string;
    expirationDate: string;
    brand: EnumBrands;
    [x: string]: any;
};


export type resCardAdd = {
    cardToken: string;
    links: Link;
};

// Card remove
export type resCardRemove = {};

export type resCardFind = {};

export type reqCardRemove = {};

export type reqCardFind = {
    dateStart: Date;
    dateEnd: Date;
    idTransaction: Number;
};

// Make payment

export type reqMakePayment = {
    customer: CustomerModel;
    payment: PaymentRequestModel;
    [x: string]: any;
};

export type resMakePayment = {
    message?: string;
    error?: boolean;
    customer: CustomerModel;
    payment: PaymentRequestModel;
};

// export type resMakePayment = {
//     cardNumber: String | undefined;
//     cardSecurityCode: Number | undefined;
//     cardDueDay: Number | undefined;
//     cardDueYear: Number | undefined;
//     cardBrand: String | undefined;
//     cardToken: string | undefined;

// };

// Repayment
export type resRepayPayment = {};

export type reqRepayPayment = {};

export interface IAdapter {
    makePayment(payload: reqMakePayment): Promise<any>;
    repayPayment(payload: reqRepayPayment): resRepayPayment;
}
