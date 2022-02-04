import { ConsultPayment } from '../Payment/ConsultPayment';

export interface ConsultTransactionPaymentIdRequestModel {
    paymentId: string;
}

export interface ConsultTransactionMerchantOrderIdRequestModel {
    merchantOrderId: string;
}

export interface ConsultTransactionRecurrentPaymentIdRequestModel {
    recurrentPaymentId: string;
}

export interface ConsultMerchantOrderIdResponseModel {
    reasonCode: number;
    reasonMessage: string;
    payments: ConsultPayment[];
}
