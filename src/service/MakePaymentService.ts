import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { TransactionPaymentService } from '../domain/Payment/Payment';
import Adapter from '../domain/Adapter';

export default class MakePaymentService {
    private logger = debug('payment-api:MakePaymentService');
    private paymentRepository = new PaymentRepository();
    private paymentOperator = new Adapter()

    public async execute(req: TransactionPaymentService) {
        try {
            this.logger('Starting method to create Payment');
            await this.paymentOperator.init(req.enterpriseId)
            const response: any = await this.paymentOperator.makePayment(req)

            if (response?.error == true) {
                return response
            }

            return await this.paymentRepository
                .persist({
                    userId: req?.userId,
                    ...response?.payment
                })
                .then(hasPersist => hasPersist);

        } catch (error) {
            console.log(error)
            return error
        }
    }
}
