import { PaymentRequestModel } from './../Payment';
import { CustomerModel } from './../Customer';

export interface TransactionCreditCardResponseModel {
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PaymentRequestModel;
}

export interface TransactionCreditCardRequestModel {
    merchantOrderId: string;
    customer: CustomerModel;
    payment: PaymentRequestModel;
    [x: string]: any;
}
