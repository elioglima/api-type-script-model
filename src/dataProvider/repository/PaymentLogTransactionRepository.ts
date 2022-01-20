import debug from 'debug';
import { PaymentLogTransaction } from '../../domain/PaymentLogTransaction';
import { getConnection } from 'typeorm';
import { PaymentLogTransactionEntity } from '../entity/PaymentLogTransactionEntity';

export class PaymentLogTransactionRepository {
    private logger = debug('service-api:PaymentLogTransactionRepository');

    public persist = async (log: PaymentLogTransaction) =>
        await getConnection()
            .getRepository(PaymentLogTransactionEntity)
            .createQueryBuilder('paymentLogTransaction')
            .insert()
            .values([
                {
                    request: log.request,
                    response: log.response,
                },
            ])
            .execute()
            .then(
                () => {
                    return log;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
}
