import debug from 'debug';
import { Cielo } from '../cielo';
import { PaymentCards } from '../domain/Payment';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';
import { reqCardAdd } from '../domain/IAdapter';

export default class CardAddService {
    private logger = debug('service-api:CardAddService');
    private paymentCardRepository = new PaymentCardsRepository();
    private cielo = new Cielo();

    public execute = async (paymentCard: PaymentCards) => {
        this.logger(`Find Card Add`);

        await this.cielo.init({ enterpriseId: paymentCard.enterpriseId });

        const cardCielo = this.cielo.card;

        if (cardCielo) {
            const cardToken: reqCardAdd = {
                brand: paymentCard.brand,
                cardNumber: paymentCard.cardNumber,
                customerName: paymentCard.customerName,
                expirationDate: paymentCard.expirationDate,
                holder: paymentCard.holder,
            };
            const token = await cardCielo
                .createCardTokenized(cardToken)
                .catch(e => new Error(e.Message));

            if (token instanceof Error) {
                console.log(token);
                return token;
            }

            return await this.paymentCardRepository.persist({
                ...paymentCard,
                token: token.cardToken,
                lastFourNumbers: paymentCard.cardNumber.slice(-4),
            });
        }

        return new Error('Cannot instance Card');
    };
}
