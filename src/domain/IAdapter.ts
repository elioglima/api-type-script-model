import { EnumBrands } from '../enum/BrandsEnum';
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

export type resMakePayment = {
    cardNumber: String | undefined;
    cardSecurityCode: Number | undefined;
    cardDueDay: Number | undefined;
    cardDueYear: Number | undefined;
    cardBrand: String | undefined;
    cardToken: string | undefined;
};

export type resRepayPayment = {};

export type reqCardRemove = {};

export type reqCardFind = {
    dateStart: Date;
    dateEnd: Date;
    idTransaction: Number;
};

export type reqMakePayment = {};

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
