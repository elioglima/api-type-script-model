import debug from 'debug';
import {
    PaymentCards,
    TFindExistsFilter,
} from '../../domain/Payment/PaymentCards';
import { getConnection } from 'typeorm';
import { PaymentCardsEntity } from '../entity/PaymentCardsEntity';

export class PaymentCardsRepository {
    private logger = debug('payment-api:PaymentCardsRepository');

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
                    enterpriseId: paymentCards.enterpriseId,
                    active: paymentCards.active,
                    hash: paymentCards.hash,
                    holder: paymentCards.holder,
                    firstFourNumbers: paymentCards.firstFourNumbers,
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

    public FindOneInclude = async (paymentCard: PaymentCards) => {
        if (!paymentCard.userId && !paymentCard.residentId) {
            return {
                err: true,
                data: {
                    message: 'incomplete parameters',
                },
            };
        }

        // prevencao de inclusao duplicada
        const filter: TFindExistsFilter = {
            userId: paymentCard.userId,
            residentId: paymentCard.residentId,
            enterpriseId: paymentCard.enterpriseId,
            firstFourNumbers: paymentCard.firstFourNumbers,
            lastFourNumbers: paymentCard.lastFourNumbers,
            brand: paymentCard.brand,
        };

        const cardExists = await this.findExists(filter);

        if (cardExists instanceof PaymentCardsEntity) {
            return new Error('Card already registered');
        }

        return this.persist(paymentCard);
    };

    public findExists = (filter: TFindExistsFilter) => {
        const db = getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards');

        // db.andWhere('active = :active', {
        //     active: true,
        // });

        if (filter.userId) {
            db.andWhere('paymentCards.userId = :userId', {
                userId: filter.userId,
            });
        } else if (filter.residentId) {
            db.andWhere('paymentCards.residentIdenty = :residentId', {
                residentId: filter.residentId,
            });
        } else {
            return {
                err: true,
                data: {
                    message: 'invalid parameters',
                },
            };
        }

        db.andWhere('paymentCards.enterpriseId = :enterpriseId', {
            enterpriseId: filter.enterpriseId,
        });

        if (filter.firstFourNumbers) {
            db.andWhere('paymentCards.firstFourNumbers = :firstFourNumbers', {
                firstFourNumbers: filter.firstFourNumbers,
            });
        }

        if (filter.lastFourNumbers) {
            db.andWhere('paymentCards.lastFourNumbers = :lastFourNumbers', {
                lastFourNumbers: filter.lastFourNumbers,
            });
        }

        if (filter.brand) {
            db.andWhere('paymentCards.brand = :brand', {
                brand: filter.brand,
            });
        }

        return db.getOne();
    };

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

    public getCardAlreadyExists = async (paymentCards: PaymentCards) =>
        await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .where('paymentCards.firstFourNumbers = :firstFourNumbers', {
                firstFourNumbers: paymentCards.firstFourNumbers,
            })
            .andWhere('paymentCards.lastFourNumbers = :lastFourNumbers', {
                lastFourNumbers: paymentCards.lastFourNumbers,
            })
            .andWhere('paymentCards.userId = :userId', {
                userId: paymentCards.userId,
            })
            .andWhere('paymentCards.deletedAt IS NULL')
            .getOne();

    public getAllUserCards = async (userId: number) =>
        await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .where('paymentCards.deletedAt IS NULL')
            .andWhere('paymentCards.userId = :userId', { userId })
            .getMany();

    public inactivateUserCards = async (userId: number) => {
        return await getConnection()
            .getRepository(PaymentCardsEntity)
            .createQueryBuilder('paymentCards')
            .update()
            .set({
                active: false,
            })
            .where('userId = :userId', { userId })
            .execute()
            .then(
                () => {
                    return userId;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };

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
