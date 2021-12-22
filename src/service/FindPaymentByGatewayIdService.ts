import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export class FindPaymentByGatewayIdService {
    private logger = debug('service-api:FindPaymentByGatewayIdService');
    private paymentRepository = new PaymentRepository();

    public execute = async (gatewayId: string) => {
        this.logger(`Find payment by id`);
        return this.paymentRepository.getByGatewayId(gatewayId).then(
            data => {
                if (data === undefined) {
                    this.logger(`Payment ${gatewayId} not found`);
                    return {};
                }

                this.logger(`${data}`);
                return data;
            },
            err => {
                this.logger(`Error: ${err}`);
                return new Error(err);
            },
        );
    };
}
