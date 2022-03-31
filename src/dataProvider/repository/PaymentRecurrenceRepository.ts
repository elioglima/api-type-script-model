import debug from 'debug';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';
import { getConnection } from 'typeorm';
import { PaymentRecurrenceEntity } from '../entity/PaymentRecurrenceEntity';

export class PaymentRecurrenceRepository {
    private logger = debug('payment-api:PaymentRecurrenceRepository');

    public persist = async (paymentRecurrence: PaymentRecurrence) =>
        await getConnection()
            .getRepository(PaymentRecurrenceEntity)
            .createQueryBuilder('paymentRecurrence')
            .insert()
            .values([
                {
                    ...paymentRecurrence,
                },
            ])
            .execute()
            .then(
                response => {
                    paymentRecurrence.id = Number(response.identifiers[0].id);
                    return paymentRecurrence;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PaymentRecurrenceEntity)
            .createQueryBuilder('paymentRecurrence')
            .where('paymentRecurrence.id = :id', { id })
            .getOne();

    public getByRecurrenceId = async (recurrentPaymentId: string) =>
        await getConnection()
            .getRepository(PaymentRecurrenceEntity)
            .createQueryBuilder('paymentRecurrence')
            .where('paymentRecurrence.recurrenceId = :recurrenceId', {
                recurrentPaymentId,
            })
            .getOne();

    public getByPreUserId = async (preUserId: number) =>
        await getConnection()
            .getRepository(PaymentRecurrenceEntity)
            .createQueryBuilder('paymentRecurrence')
            .where('paymentRecurrence.preUserId = :preUserId', {
                preUserId,
            })
            .getOne()
            .then(
                (data) => {
                    return data;
                },
                onRejected => {                    
                    return onRejected;
                },
            );

    public getUserRecurrence = async (userId: number) =>
        await getConnection()
            .getRepository(PaymentRecurrenceEntity)
            .createQueryBuilder('paymentRecurrence')

            .where('paymentRecurrence.userId = :userId', { userId })
            .getMany();

    public update = async (paymentRecurrence: PaymentRecurrence) => {
        return await getConnection()
            .getRepository(PaymentRecurrenceEntity)
            .createQueryBuilder('paymentRecurrence')
            .update()
            .set(paymentRecurrence)
            .where('id = :id', { id: paymentRecurrence.id })
            .execute()
            .then(
                () => {
                    return paymentRecurrence;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };
}
