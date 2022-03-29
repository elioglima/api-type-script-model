import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { TransactionPaymentService } from '../domain/Payment/Payment';
import Adapter from '../domain/Adapter';
import { cieloStatusConverter } from '../utils/cieloStatus';

export default class MakePaymentService {
    private logger = debug('payment-api:MakePaymentService');
    private paymentRepository = new PaymentRepository();
    private paymentOperator = new Adapter();

    public async execute(req: TransactionPaymentService) {
        try {
            this.logger('Starting method to create Payment');
            await this.paymentOperator.init(req.enterpriseId);

            //pagamento em centavos
            const saveAmount = req.payment.amount;
            req.payment.amount = req.payment.amount * 100;
            const response: any = await this.paymentOperator.makePayment(req);

            if (response?.err == true) {
                return response;
            }

            response.payment.status = cieloStatusConverter(
                response.payment.status,
            );

            if (response.payment.status !== 'PAGO') {
                return {
                    err: true,
                    message: `Payment ${response.payment.status}`,
                };
            }

            /*
              Cadastrar usuario se for primeiro pagamento
                
            */

            return await this.paymentRepository
                .persist({
                    userId: req?.userId,
                    enterpriseId: req.enterpriseId,
                    ...response?.payment,
                    amount: saveAmount,
                    product: req.payment.product,
                })
                .then(hasPersist => hasPersist);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
