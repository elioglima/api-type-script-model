import { IAdapter } from '../domain/IAdapter';

export class StripeAdapter implements IAdapter {
    readonly API_URL = 'stripe.com';

    public addCreditCard() {
        return true;
    }

    public getCreditCards() {
        return {
            url: this.API_URL,
        };
    }

    public removeCreditCard() {
        return true;
    }

    public makePayment() {
        return true;
    }

    public refoundPayment() {
        return true;
    }
}
