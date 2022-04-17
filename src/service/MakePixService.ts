import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';
import { TransactioPixRequestModel } from '../domain/Payment/Payment';
import AdapterPayment from '../domain/AdapterPayment';
import { cieloStatusConverter } from '../utils/cieloStatus';

export default class MakePixService {
    private logger = debug('payment-api:MakePaymentService');
    private paymentRepository = new PaymentRepository();
    private paymentOperator = new AdapterPayment();

    public async execute(req: TransactioPixRequestModel) {
        try {
            this.logger('Starting method to create Payment');
            await this.paymentOperator.init(1);

            //pagamento em centavos
            const saveAmount = req.payment.amount;
            req.payment.amount = req.payment.amount * 100;
            const response: any = await this.paymentOperator.makePix(req);
            

            if (response?.err == true) {
                return response;
            }

            // response.payment.status = cieloStatusConverter(
            //     response.payment.status,
            // );

            // if (response.payment.status !== 'PAGO') {
            //     return {
            //         err: true,
            //         message: `Payment ${response.payment.status}`,
            //     };
            // }

            return await this.paymentRepository
                .persist({
                    userId: req?.userId,
                    enterpriseId: req.enterpriseId,
                    ...response?.payment,
                    amount: saveAmount,
                    product: req.payment.softDescriptor ?? '',
                })
                .then(hasPersist => hasPersist);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    public async getPixReceipt(req: any){
        await this.paymentOperator.init(1);
        const response: any = await this.paymentOperator.find(req);
        return response

    }
}
