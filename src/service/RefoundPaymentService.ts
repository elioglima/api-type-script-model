import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import AdapterPayment from '../domain/AdapterPayment';
import { cieloStatusConverter } from '../utils/cieloStatus';

export default class RefoundPaymentService {
    private logger = debug('service-api:RefoundPaymentService');
    private paymentRepository = new PaymentRepository();
    private paymentOperator = new AdapterPayment();

    public async execute(idPayment: number) {
        try {
            this.logger('Starting method to refound Payment');

            const payment = await this.paymentRepository.getById(idPayment);

            if (payment == undefined) {
                return new Error('Cannot find this payment');
            }

            await this.paymentOperator.init(Number(payment.enterpriseId));

            const response: any = await this.paymentOperator.refoundPayment({
                amount: Number(payment.value) * 100,
                paymentId: String(payment.transactionId),
            });

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

            return await this.paymentRepository
                .update(update)
                .then(hasPersist => hasPersist);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
