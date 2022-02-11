import debug from 'debug';
import { Payment } from '../../domain/Payment/Payment';
import { getConnection } from 'typeorm';
import { PaymentEntity } from '../entity/PaymentEntity';

export class PaymentRepository {
    private logger = debug('service-api:PaymentRepository');

    public persist = async (payment: Payment) =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .insert()
            .values([
                {
                    transactionId: payment.transactionId,
                    transactionMessage: payment.transactionMessage,
                    descriptionMessage: payment.descriptionMessage,
                    descriptionIdReference: payment.descriptionIdReference,
                    status: payment.status,
                    userId: payment.userId,
                    value: payment.value,
                },
            ])
            .execute()
            .then(
                response => {
                    payment.id = Number(response.identifiers[0].id);
                    return payment;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .where('payment.id = :id', { id })
            .getOne();

    public getByTransactionId = async (transactionId: string) =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .where('payment.transactionId = :transactionId', { transactionId })
            .getOne();

    public getUserPayments = async (userId: number, daysFilter?: number) => {
        const query = getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .select([
                'payment.descriptionMessage,payment.status,payment.value,payment.id,DATE_FORMAT(payment.createdAt, "%d/%m/%Y") as day',
            ])
            .where('payment.userId = :userId', { userId });

        if (daysFilter) {
            query.andWhere(
                'payment.createdAt > (NOW() - INTERVAL :daysFilter DAY)',
                { daysFilter },
            );
        }

        return query.getRawMany();
    };

    public update = async (payment: Payment) => {
        return await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .update()
            .set(payment)
            .where('id = :id', { id: payment.id })
            .execute()
            .then(
                () => {
                    return payment;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };
}
