import { EnumRecurrentPaymentUpdateInterval } from '../../enum/RecurrentPaymentIntervalEnum';
import { CustomerModel } from '../Customer';
import { PaymentRecurrentModifyModel } from '../Payment';

export interface RecurrentModifyModel {
    invoiceId: number;
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

export interface RecurrentModifyEndDateModel extends RecurrentModifyModel {
    endDate: string;
}

export interface RecurrentModifyIntervalModel extends RecurrentModifyModel {
    interval: EnumRecurrentPaymentUpdateInterval;
}

export interface RecurrentModifyDayModel extends RecurrentModifyModel {
    recurrencyDay: number;
}
