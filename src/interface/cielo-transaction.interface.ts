export type TLoaded = {
    error: Boolean;
    message: String;
}

export interface CieloTransactionInterface {
    enterpriseProvider: string;
    enterpriseProviderId: Number;
    hostnameTransacao: string;
    hostnameQuery?: string;
    merchantId: string;
    merchantKey: string;
    requestId: string;
    loaded: TLoaded;
}

export interface IEnterprise {
    provider: string;
    id: Number;
}


