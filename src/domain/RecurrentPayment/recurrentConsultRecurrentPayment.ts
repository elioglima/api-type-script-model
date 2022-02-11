import { Link } from '../IAdapter';
import { RecurrentTransaction } from './recurrentTransaction';

export interface RecurrentConsultRecurrentPaymentConsultResponseModel {
    recurrentPaymentId: string;
    nextRecurrency: string;
    startDate: string;
    endDate: string;
    interval: string;
    amount: number;
    country: string;
    createDate: Date;
    currency: string;
    currentRecurrencyTry: number;
    provider: string;
    recurrencyDay: number;
    successfulRecurrences: number;
    links: Link[];
    recurrentTransactions: RecurrentTransaction[];
    status: number;
}
