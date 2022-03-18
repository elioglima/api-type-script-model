import debug from 'debug';
import { Payment } from '../domain/Payment/Payment';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { PaymentEntity } from '../dataProvider/entity/PaymentEntity';

export class UpdateByGatewayIdService {
    private logger = debug('payment-api:UpdateByGatewayIdService');
    private paymentRepository = new PaymentRepository();

    public async execute(payment: Payment) {
        const hasPayment = await this.paymentRepository.getById(payment.id);

        if (hasPayment instanceof PaymentEntity) {
            this.logger(`Updating Payment`);

            payment.id = Number(hasPayment.id);

            return await this.paymentRepository
                .update(payment)
                .then(hasUpdate => hasUpdate);
        }
    }
}
