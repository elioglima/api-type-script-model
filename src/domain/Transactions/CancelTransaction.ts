import { Link } from '../IAdapter';

export interface CancelTransactionResponseModel {
    status: number;
    tid: string;
    proofOfSale: string;
    authorizationCode: string;
    returnCode: string;
    returnMessage: string;
    links: Link[];
}

export interface CancelTransactionRequestModel {
    paymentId?: string;
    merchantOrderId?: string;
    amount?: number;
    [x: string]: any;
}
