import debug from 'debug';
import AdapterPayment from '../domain/AdapterPayment';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { PaymentStatus } from '../enum/PaymentStatusEnum';

export const cieloStatusConverter = (cieloStatus: number) => {
    const paidStatus = [1, 2];
    const refusedStatus = [3];
    const refundedStatus = [10, 11];
    const canceledStatus = [13];

    if (paidStatus.includes(cieloStatus)) return PaymentStatus.PAID;
    else if (refusedStatus.includes(cieloStatus)) return PaymentStatus.ERROR;
    else if (refundedStatus.includes(cieloStatus))
        return PaymentStatus.REFUNDED;
    else if (canceledStatus.includes(cieloStatus))
        return PaymentStatus.CANCELED;
    else return PaymentStatus.ERROR;
};
export default class RefoundPaymentService {
    private logger = debug('service-api:RefoundPaymentService');
    private paymentOperator = new AdapterPayment();
    private paymentRepository = new PaymentRepository();

    public async refound(idPayment: number) {
        try {
            this.logger('Starting method to refound Payment');

            const payment = await this.paymentRepository.getById(idPayment);

            if (payment == undefined) {
                return new Error('Cannot find this payment');
            }

            await this.paymentOperator.init(Number(payment.enterpriseId));

            let response: any = await this.paymentOperator.refoundPayment({
                amount: Number(payment.value) * 100,
                paymentId: String(payment.transactionId),
            });

            console.log(888877, response);

            if (response?.err == true) {
                return {
                    err: true,
                    message: response.data.message[0],
                };
            }

            response.status = cieloStatusConverter(response.status);

            const update: any = {
                status: response.status,
                id: idPayment,
            };

            console.log(111111, update);
            return await this.paymentRepository
                .update(update)
                .then(hasPersist => hasPersist);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    public async refundInvoice(
        enterpriseId: number,
        paymentId: String,
        amount: number,
    ) {
        try {
            this.logger('Starting method to refound Payment');

            await this.paymentOperator.init(Number(enterpriseId));

            const response: any = await this.paymentOperator.refoundPayment({
                amount: amount * 1,
                paymentId: String(paymentId),
            });

            if (response?.err == true) {
                return {
                    err: true,
                    message: response.data.message[0],
                };
            }

            response.status = cieloStatusConverter(response.status);

            const data: any = {
                status: response.status,
            };

            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
