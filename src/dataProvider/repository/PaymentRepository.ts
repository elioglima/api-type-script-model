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
                    gatewayId: payment.gatewayId,
                    status: payment.status,
                    type: payment.type,
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
            .andWhere('payment.deletedAt IS NULL')
            .getOne();

    public getByGatewayId = async (gatewayId: string) =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .where('payment.gatewayId = :gatewayId', { gatewayId })
            .andWhere('payment.deletedAt IS NULL')
            .getOne();

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
