import { CustomerModel } from '../Customer';
import { RecurrentConsultRecurrentPaymentConsultResponseModel } from './recurrentConsultRecurrentPayment';

export interface RecurrentPaymentConsultResponseModel {
    customer: CustomerModel;
    recurrentPayment: RecurrentConsultRecurrentPaymentConsultResponseModel;
}
