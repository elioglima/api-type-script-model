import debug from 'debug';
import { PaymentRecurrenceRepository } from '../dataProvider/repository/PaymentRecurrenceRepository';
import { PaymentRecurrence } from '../domain/Payment/PaymentRecurrence';

export default class MakeRecurrenceService {
    private logger = debug('service-api:MakeRecurrenceService');
    private paymentRecurrenceRepository = new PaymentRecurrenceRepository();

    public async execute(paymentRecurrence: PaymentRecurrence) {
        this.logger('Starting method to create Payment Recurrence');
        return await this.paymentRecurrenceRepository
            .persist(paymentRecurrence)
            .then(hasPersist => hasPersist);
    }
}
