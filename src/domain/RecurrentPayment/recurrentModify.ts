import { CustomerModel } from '../Customer';
import { PaymentRecurrentModifyModel } from '../Payment';

export interface RecurrentModifyModel {
    paymentId: string;
}

export interface RecurrentModifyCustomerModel extends RecurrentModifyModel {
    customer: CustomerModel;
}

export interface RecurrentModifyAmountModel extends RecurrentModifyModel {
    amount: number;
}

export interface RecurrentModifyNextPaymentDateModel
    extends RecurrentModifyModel {
    nextPaymentDate: string;
}

export interface RecurrentModifyPaymentModel extends RecurrentModifyModel {
    payment: PaymentRecurrentModifyModel;
}
