import debug from 'debug';
import { PaymentCards } from '../domain/Payment/PaymentCards';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';
import { PaymentCardsEntity } from '../dataProvider/entity/PaymentCardsEntity';

export class UpdatePaymentCardService {
    private logger = debug('payment-api:UpdatePaymentCardService');
    private paymentCardsRepository = new PaymentCardsRepository();

    public async execute(paymentCards: PaymentCards) {
        const hasPaymentCard = await this.paymentCardsRepository.getById(
            paymentCards.id,
        );

        if (hasPaymentCard instanceof PaymentCardsEntity) {
            this.logger(`Updating Payment`);

            return await this.paymentCardsRepository
                .update(paymentCards)
                .then(hasUpdate => hasUpdate);
        }
    }
}
