import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { TransactionPaymentService } from '../domain/Payment/Payment';
import Adapter from '../domain/Adapter';


import {
    TErrorGeneric,
    resMakePayment,
} from '../domain/IAdapter';


export default class MakePaymentService {
    private logger = debug('service-api:MakePaymentService');
    private paymentRepository = new PaymentRepository();

    public async execute(req: TransactionPaymentService) {

        this.logger('Starting method to create Payment');
        const paymentOperator = new Adapter({
            provider: 'Cielo',
            id: req.payment.enterpriseId
        })

        const response: resMakePayment | TErrorGeneric = await paymentOperator.makePayment(req.payment)
        if (response.error == true) {
            return response
        }

        return await this.paymentRepository
            .persist(req.payment)
            .then(hasPersist => hasPersist);
    }
}
