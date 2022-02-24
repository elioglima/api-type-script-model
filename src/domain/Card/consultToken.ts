export interface ConsultTokenRequestModel {
    cardToken: string;
}

export interface ConsultTokenResponseModel {
    cardNumber: string;
    holder: string;
    expirationDate: string;
}
