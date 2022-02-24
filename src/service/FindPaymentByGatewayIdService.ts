import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export class FindPaymentByGatewayIdService {
    private logger = debug('payment-api:FindPaymentByGatewayIdService');
    private paymentRepository = new PaymentRepository();

    public execute = async (gatewayId: number) => {
        this.logger(`Find payment by id`);
        return this.paymentRepository.getById(gatewayId).then(
            data => {
                if (data === undefined) {
                    this.logger(`Payment ${gatewayId} not found`);
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
