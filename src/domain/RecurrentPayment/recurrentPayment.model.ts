import { EnumRecurrentPaymentInterval } from '../../enum/RecurrentPaymentIntervalEnum';

export interface RecurrentPaymentModel {
    authorizeNow?: boolean;
    startDate?: string;
    endDate?: string;
    interval?: EnumRecurrentPaymentInterval;
    [x: string]: any;
}
