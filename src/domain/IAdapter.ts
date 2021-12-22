export interface IAdapter {
    readonly API_URL: string;

    addCreditCard(): boolean;
    getCreditCards(): object;
    removeCreditCard(): boolean;

    makePayment(): boolean;
    refoundPayment(): boolean;
}
