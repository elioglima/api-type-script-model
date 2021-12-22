import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { Payment } from '../domain/Payment';

export class CreatePaymentService {
    private logger = debug('service-api:CreatePaymentService');
    private paymentRepository = new PaymentRepository();

    public async execute(payment: Payment) {
        this.logger('Starting method to create Payment');
        return await this.paymentRepository
            .persist(payment)
            .then(hasPersist => hasPersist);
    }
}
