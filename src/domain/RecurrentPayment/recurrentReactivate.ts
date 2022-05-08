
import { PaymentRecurrentModifyModel } from '../Payment';

export type reqRecurrentReactivate = {
    recurrenceId: string;
};

export type resRecurrentReactivate = {};

export type reqRecurrenceModify = {
    paymentId: string,
    modify: PaymentRecurrentModifyModel
}

export type resRecurrentModify = {}