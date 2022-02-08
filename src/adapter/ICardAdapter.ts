import {
    reqMakePayment,
    resMakePayment,
    reqCardAdd,
    reqCardFind,
    reqCardRemove,
    resCardAdd,
    resCardFind,
    resCardRemove,
} from 'src/domain/IAdapter';

export interface ICardAdapter {
    readonly API_URL: string | undefined;
    makePayment(transaction: reqMakePayment): Promise<resMakePayment>;

    readURL(): string | undefined;

    cardAdd(payload: reqCardAdd): Promise<resCardAdd>;
    cardRemove(payload: reqCardRemove): resCardRemove;
    cardFind(payload: reqCardFind): resCardFind;
}
