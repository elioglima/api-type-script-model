import debug from 'debug';
import {
    PaymentCards,
    TFindExistsFilter,
} from '../../domain/Payment/PaymentCards';
import { getConnection } from 'typeorm';
import { PaymentCardsEntity } from '../entity/PaymentCardsEntity';
import { rError, rSuccess } from '../../utils';

export class PaymentCardsRepository {
    private logger = debug('payment-api:PaymentCardsRepository');

    public persist = async (paymentCard: PaymentCards) => {
        try {
            if (!paymentCard?.userId && !paymentCard?.residentId)
                return rError({ message: 'invalid parameters' });

            if (!paymentCard?.token)
                return rError({ message: 'failed to harvest cardtoken' });

            const newCard: PaymentCards = {
                lastFourNumbers: paymentCard.lastFourNumbers,
                brand: paymentCard.brand,
                ...(paymentCard.userId ? { userId: paymentCard.userId } : {}),
                ...(paymentCard.residentId
                    ? { residentId: paymentCard.residentId }
                    : {}),
                enterpriseId: paymentCard.enterpriseId,
                active: paymentCard.active,
                hash: paymentCard.hash,
                hashC: paymentCard.hashC,
                holder: paymentCard.holder,
                expirationDate: paymentCard.expirationDate,
                firstFourNumbers: paymentCard.firstFourNumbers,
                token: paymentCard.token,
            };

            const data = await getConnection()
                .getRepository(PaymentCardsEntity)
                .createQueryBuilder('paymentCards')
                .insert()
                .values(newCard)
                .execute()
                .then(
                    response => {
                        paymentCard.id = Number(response.identifiers[0].id);
                        return paymentCard;
                    },
                    onRejected => {
                        this.logger('Error ', onRejected);
                        return onRejected;
                    },
                );

            return rSuccess({ message: 'processed data', ...data });
        } catch (error: any) {
            return rError({ message: error?.message });
        }
    };

    public FindOneInclude = async (paymentCard: PaymentCards) => {
        try {
            if (!paymentCard.userId && !paymentCard.residentId)
                return rError({ message: 'incomplete parameters' });

            // prevencao de inclusao duplicada
            const filter: TFindExistsFilter = {
                enterpriseId: paymentCard.enterpriseId,
                ...(paymentCard.userId ? { userId: paymentCard.userId } : {}),
                ...(paymentCard.residentId
                    ? { residentId: paymentCard.residentId }
                    : {}),
                firstFourNumbers: paymentCard.firstFourNumbers,
                lastFourNumbers: paymentCard.lastFourNumbers,
                brand: paymentCard.brand,
                token: paymentCard.token,
            };

            const cardExists = await this.findExists(filter);

            if (cardExists?.err)
                return rError({
                    message: 'Card already registered',
                    ...cardExists,
                });

            return await this.persist(paymentCard);
        } catch (error: any) {
            return rError({ message: error?.message });
        }
    };

    public findExists = async (filter: TFindExistsFilter) => {
        try {
            console.log('findExists.filter', filter);
            const db = getConnection()
                .getRepository(PaymentCardsEntity)
                .createQueryBuilder('paymentCards')
                .where('paymentCards.deletedAt IS NULL');

            if (filter.userId) {
                db.andWhere('paymentCards.userId = :userId', {
                    userId: filter.userId,
                });
            } else if (filter.residentId) {
                db.andWhere('paymentCards.residentId = :residentId', {
                    residentId: filter.residentId,
                });
            } else return rError({ message: 'invalid parameters' });

            db.andWhere('paymentCards.enterpriseId = :enterpriseId', {
                enterpriseId: filter.enterpriseId,
            });

            if (filter.firstFourNumbers) {
                db.andWhere(
                    'paymentCards.firstFourNumbers = :firstFourNumbers',
                    {
                        firstFourNumbers: filter.firstFourNumbers,
                    },
                );
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

            const data = await db.getOne();
            if (!data)
                return rSuccess({ message: 'processed data', row: undefined });

            return rSuccess({ message: 'processed data', row: data });
        } catch (error: any) {
            console.log('findExists', error);
            return rError({ message: error?.message });
        }
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
