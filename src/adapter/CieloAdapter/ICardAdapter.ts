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
    makePayment(transaction: reqMakePayment): Promise<resMakePayment | TErrorGeneric>;
    cardAdd(payload: reqCardAdd): Promise<resCardAdd | TErrorGeneric>;
    cardRemove(payload: reqCardRemove): resCardRemove | TErrorGeneric;
    cardFind(payload: reqCardFind): resCardFind | TErrorGeneric;


}


