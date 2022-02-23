import { IAdapterBase } from './IAdapterBase'
import {
    TErrorGeneric,
    reqMakePayment,
    resMakePayment,
    reqCardAdd,
    reqCardFind,
    reqCardRemove,
    resCardAdd,
    resCardFind,
    resCardRemove,
} from 'src/domain/IAdapter';

export interface ICardAdapter extends IAdapterBase {

    readonly API_URL: string | undefined;

    makePayment(transaction: reqMakePayment): Promise<resMakePayment | TErrorGeneric>;
    readURL(): string | undefined;
    cardAdd(payload: reqCardAdd): Promise<resCardAdd | TErrorGeneric>;
    cardRemove(payload: reqCardRemove): resCardRemove | TErrorGeneric;
    cardFind(payload: reqCardFind): resCardFind | TErrorGeneric;
}


