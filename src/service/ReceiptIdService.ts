import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export default class ReceiptIdService {
    private logger = debug('service-api:ReceiptIdService');
    private paymentRepository = new PaymentRepository();

    public execute = async (
        userId: number,
        paymentId?: string,
        daysFilter?: number,
    ) => {
        this.logger(`Find payment by id`);

        if (paymentId) {
            const data = await this.paymentRepository.getByTransactionId(
                paymentId,
            );

            if (data == undefined) return new Error('Payment not found');
            else return data;
        } else {
            return await this.paymentRepository.getUserPayments(
                userId,
                daysFilter,
            );
        }
    };
}
