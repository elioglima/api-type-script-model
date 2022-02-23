import { PaymentStatus } from 'src/enum/PaymentStatusEnum';
import { CustomerModel } from '../Customer/customer.model';
import { PaymentRequestModel } from './paymentRequest.model';

export interface Payment { // payment
    enterpriseId: number;
    id: number;
    userId: number;
    transactionId: string;
    transactionMessage: string;
    value: number;
    status: PaymentStatus;
    descriptionMessage: string;
    descriptionIdReference: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionCreditCardRequestModel {
    customer: CustomerModel;
    payment: PaymentRequestModel;
    [x: string]: any;
}

export interface TransactionPaymentService {
    [x: string]: any;
}
