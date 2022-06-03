export type TMailAws = {
    template: string;
    language: string;
    email: string;
    data?: TDataMailAws | any;
};

type TDataMailAws = {
    name?: string;
    hash?: string;
};

export type TReqConfigurePayment = {
    language: string;
    email: string;
    data: TReqConfigurePaymentData;
};

export type TReqErrorPaymentData = {
    date: Date;
    name: string;
    invoiceNumber: number;
    amount: number;
};

export type TReqErrorPayment = {
    language: string;
    email: string;
    data: TReqErrorPaymentData;
};

export type TReqFirstPaymentData = {
    date: Date;
    link: string;
    name: string;
    invoiceNumber: number;
    amount: number;
};

export type TReqFirstPayment = {
    language: string;
    email: string;
    data: TReqFirstPaymentData;
};

export type TReqForgotPassportData = {
    name: string;
    changePassURL: string;
};

export type TReqForgotPassport = {
    language: string;
    email: string;
    data: TReqFirstPaymentData;
};

export type TReqConfigurePaymentData = {
    date: Date;
    name: string;
    invoiceNumber: number;
    amount: number;
    link: string;
};

export type TReqInvoiceAvailableData = {
    date: Date;
    name: string;
    invoiceNumber: number;
    amount: number;
    link: string;
};

export type TReqInvoiceAvailable = {
    language: string;
    email: string;
    data: TReqInvoiceAvailableData;
};

export type TReqLinkPaymentData = {
    date: Date;
    name: string;
    invoiceNumber: number;
    amount: number;
    link: string;
};

export type TReqLinkPayment = {
    language: string;
    email: string;
    data: TReqLinkPaymentData;
};

export type TReqPaymentNewData = {
    date: Date;
    name: string;
    invoiceNumber: number;
    amount: number;
    link: string;
};

export type TReqPaymentNew = {
    language: string;
    email: string;
    data: TReqPaymentNewData;
};

export type TReqPaymentRejectData = {
    date: Date;
    name: string;
    invoiceNumber: number;
    amount: number;
};

export type TReqPaymentReject = {
    language: string;
    email: string;
    data: TReqPaymentNewData;
};

export type TReqPaymentSuccessData = {
    date: Date;
    name: string;
    invoiceNumber: number;
    amount: number;
    link: string;
};

export type TReqPaymentSuccess = {
    language: string;
    email: string;
    data: TReqPaymentSuccessData;
};

export type TReqWelcomeData = {
    name: string;
    changePassURL: string;
};

export type TReqWelcome = {
    language: string;
    email: string;
    data: TReqWelcomeData;
};

export type TReqWelcomeUserData = {
    name: string;
    changePassURL: string;
};

export type TReqWelcomeUser = {
    language: string;
    email: string;
    data: TReqWelcomeUserData;
};
