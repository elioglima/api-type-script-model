import debug from 'debug';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';
import { getConnection } from 'typeorm';
import { PaymentRecurrenceEntity } from '../entity/PaymentRecurrenceEntity';
import { rError, rSuccess } from '../../utils';

export class PaymentRecurrenceRepository {
    private logger = debug('payment-api:PaymentRecurrenceRepository');

    public persist = async (paymentRecurrence: PaymentRecurrence) => {
        try {
            const row = await getConnection()
                .getRepository(PaymentRecurrenceEntity)
                .createQueryBuilder('paymentRecurrence')
                .insert()
                .values([
                    {
                        ...paymentRecurrence,
                        active: true,
                    },
                ])
                .execute()
                .then(
                    response => {
                        paymentRecurrence.id = Number(
                            response.identifiers[0].id,
                        );
                        return paymentRecurrence;
                    },
                    onRejected => {
                        this.logger('Error ', onRejected);
                        return onRejected;
                    },
                );

            return rSuccess({ message: 'processed data', row });
        } catch (error: any) {
            return rError({ message: error?.message, row: undefined });
        }
    };

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PaymentRecurrenceEntity)
            .createQueryBuilder('paymentRecurrence')
            .where('paymentRecurrence.id = :id', { id })
            .getOne();

    public getByResidentId = async (residentId: number) => {
        try {
            const row = await getConnection()
                .getRepository(PaymentRecurrenceEntity)
                .createQueryBuilder('paymentRecurrence')
                .where('paymentRecurrence.residentId = :residentId', {
                    residentId,
                })
                .getOne()
                .then(
                    onAccept => {
                        return onAccept;
                    },
                    onRejected => {
                        this.logger('Error ', onRejected);
                        return onRejected;
                    },
                );

            if (!row)
                return rSuccess({ message: 'processed data', row: undefined });

            return rSuccess({ message: 'processed data', row });
        } catch (error: any) {
            return rError({ message: error?.message, row: undefined });
        }
    };

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
                data => {
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
