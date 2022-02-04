import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { Payment } from '../domain/Payment/Payment';

export default class MakePaymentService {
    private logger = debug('service-api:MakePaymentService');
    private paymentRepository = new PaymentRepository();

    public async execute(payment: Payment) {
        this.logger('Starting method to create Payment');
        return await this.paymentRepository
            .persist(payment)
            .then(hasPersist => hasPersist);
    }
}
