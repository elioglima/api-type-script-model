
export type resCardAdd = {

}

export type resCardRemove = {

}

export type resCardFind = {

}

export type resMakePayment = {
    cardNumber: String | undefined,
    cardSecurityCode: Number | undefined,
    cardDueDay: Number | undefined,
    cardDueYear: Number | undefined,
    cardBrand: String | undefined,
    cardToken: string | undefined
}

export type resRepayPayment = {

}



export type reqCardAdd = {

}

export type reqCardRemove = {

}

export type reqCardFind = {
    dateStart: Date,
    dateEnd: Date,
    idTransaction: Number
}

export type reqMakePayment = {

}

export type reqRepayPayment = {

}

export interface IAdapter {
    readonly API_URL: string | undefined;

    readURL(): string | undefined;

    cardAdd(payload: reqCardAdd): resCardAdd;
    cardRemove(payload: reqCardRemove): resCardRemove;
    cardFind(payload: reqCardFind): resCardFind;

    makePayment(payload: reqMakePayment): resMakePayment;
    repayPayment(payload: reqRepayPayment): resRepayPayment;
}




