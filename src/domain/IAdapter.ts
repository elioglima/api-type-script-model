import { EnumBrands } from '../enum/BrandsEnum';
import { CustomerModel } from './Customer/customer.model';
import { PaymentRequestModel } from './Payment/paymentRequest.model';
export interface Link {
    Method: string;
    Rel: string;
    Href: string;
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
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PaymentRequestModel;
    [x: string]: any;
};

export type resMakePayment = {
    merchantOrderId: string;
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
    readonly API_URL: string | undefined;

    readURL(): string | undefined;

    cardAdd(payload: reqCardAdd): Promise<resCardAdd>;
    cardRemove(payload: reqCardRemove): resCardRemove;
    cardFind(payload: reqCardFind): resCardFind;

    makePayment(payload: reqMakePayment): resMakePayment;
    repayPayment(payload: reqRepayPayment): resRepayPayment;
}
