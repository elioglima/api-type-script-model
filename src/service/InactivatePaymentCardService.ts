import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';

export class InactivatePaymentCardService {
    private paymentCardsRepository = new PaymentCardsRepository();

    public async execute(userId: number) {
        return await this.paymentCardsRepository
            .inactivateUserCards(userId)
            .then(hasUpdate => hasUpdate);
    }
}
