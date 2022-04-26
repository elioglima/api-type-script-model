import debug from 'debug';
import { PaymentRecurrenceRepository } from '../dataProvider/repository/PaymentRecurrenceRepository';

export class FindResidentRecurrenceService {
    private logger = debug('payment-api:FindResidentRecurrenceService');
    private paymentRecurrenceRepository = new PaymentRecurrenceRepository();

    public execute = async (residentId: number) => {
        this.logger(`Find payment by resident id`);

        return await this.paymentRecurrenceRepository.getByResidentId(residentId);
    };
}
