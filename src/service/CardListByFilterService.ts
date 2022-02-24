import debug from 'debug';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';

export default class CardListByFilterService {
    private logger = debug('payment-api:CardListByFilterService');
    private paymentCardsRepository = new PaymentCardsRepository();

    public execute = async (userId: number) => {
        this.logger(`Find card by id`);
        return this.paymentCardsRepository.getAllUserCards(userId);
    };
}
