import { PaymentStatus } from '../../enum/PaymentStatusEnum';
import { CustomerModel } from '../Customer/customer.model';
import { PaymentRequestModel } from './paymentRequest.model';

export interface Payment {
    // payment
    enterpriseId: number;
    id: number;
    userId: number;
    paymentId: string;
    returnMessage: string;
    returnCode: number;
    amount: number;
    status: PaymentStatus;
    descriptionMessage: string;
    product: string;
    descriptionIdReference: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionCreditCardRequestModel {
    customer: CustomerModel;
    payment: PaymentRequestModel;
    [x: string]: any;
}

//criar flag se primeiro pagamento nao obrigatoria
export interface TransactionPaymentService {
    customer: CustomerModel;
    payment: PaymentRequestModel;
    paymentData: Payment;
    [x: string]: any;
}
