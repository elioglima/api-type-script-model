import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export class FindPaymentByIdService {
    private logger = debug('service-api:FindPaymentByIdService');
    private paymentRepository = new PaymentRepository();

    public execute = async (paymentId: number) => {
        this.logger(`Find payment by id`);
        return this.paymentRepository.getById(paymentId).then(
            data => {
                if (data === undefined) {
                    this.logger(`Payment ${paymentId} not found`);
                    return {};
                }

                this.logger(`${data}`);
                return data;
            },
            (err: string | undefined) => {
                this.logger(`Error: ${err}`);
                return new Error(err);
            },
        );
    };
}
