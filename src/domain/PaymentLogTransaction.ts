export interface PaymentLogTransaction {
    request: string;
    response: string;
    createdAt: Date;
}

export interface ConsultTransactionPaymentIdRequestModel {
    paymentId: string;
}

export interface ConsultTransactionMerchantOrderIdRequestModel {
    merchantOrderId: string;
}

export interface ConsultTransactionRecurrentPaymentIdRequestModel {
    recurrentPaymentId: string;
}
export interface ConsultTokenResponseModel {
    cardNumber: string;
    holder: string;
    expirationDate: string;
}
