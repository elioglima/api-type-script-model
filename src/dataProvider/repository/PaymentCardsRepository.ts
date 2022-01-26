import debug from 'debug';
import { PaymentCards } from '../../domain/PaymentCards';
import { getConnection } from 'typeorm';
import { PaymentCardsEntity } from '../entity/PaymentCardsEntity';

export class PaymentCardsRepository {
    private logger = debug('service-api:PaymentCardsRepository');

    public persist = async (paymentCards: PaymentCards) =>
        await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .insert()
            .values([
                {
                    lastFourNumbers: paymentCards.lastFourNumbers,
                    token: paymentCards.token,
                    brand: paymentCards.brand,
                    userId: paymentCards.userId,
                },
            ])
            .execute()
            .then(
                response => {
                    paymentCards.id = Number(response.identifiers[0].id);
                    return paymentCards;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .where('paymentCards.id = :id', { id })
            .andWhere('paymentCards.deletedAt IS NULL')
            .getOne();

    public getAllCards = async () =>
        await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .where('paymentCards.deletedAt IS NULL')
            .getMany();

    public getAllUserCards = async (userId: number) =>
        await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .where('paymentCards.deletedAt IS NULL')
            .andWhere('paymentCards.userId = :userId', { userId })
            .getMany();

    public update = async (paymentCards: PaymentCards) => {
        return await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .update()
            .set(paymentCards)
            .where('id = :id', { id: paymentCards.id })
            .execute()
            .then(
                () => {
                    return paymentCards;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };
}
