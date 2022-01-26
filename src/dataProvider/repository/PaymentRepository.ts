import debug from 'debug';
import { Payment } from '../../domain/Payment';
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

    public getUserPayments = async (userId: number) =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .where('payment.userId = :userId', { userId })
            .andWhere('payment.createdAt > (NOW() - INTERVAL 5 MONTH)')
            .getMany();

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
