import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export class FindAllPaymentService {
    private logger = debug('service-api:FindAllPaymentService');
    private paymentRepository = new PaymentRepository();

    public execute = async () => {
        this.logger(`Find payment by id`);

        return await this.paymentRepository.getAll();
    };
}
