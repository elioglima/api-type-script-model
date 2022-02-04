import { IAdapter, reqRepayPayment, resRepayPayment } from '../domain/IAdapter';

export class StripeAdapter implements IAdapter {
    readonly API_URL = 'stripe.com';

    public readURL(): string | undefined {
        throw new Error('Method not implemented.');
    }

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
        return new Promise((resolved, _reject) => {
            return resolved(true);
        });
    }

    public refoundPayment() {
        return true;
    }

    public repayPayment(_payload: reqRepayPayment): resRepayPayment {
        return true;
    }
}
