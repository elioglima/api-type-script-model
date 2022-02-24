import debug from 'debug';
import { PaymentCards } from '../domain/Payment';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';
import { reqCardAdd } from '../domain/IAdapter';
import Adapter from '../domain/Adapter';

export default class CardAddService {
    private logger = debug('payment-api:CardAddService');
    private paymentCardRepository = new PaymentCardsRepository();
    private paymentOperator = new Adapter()

    public execute = async (paymentCard: PaymentCards) => {
        try {

            this.logger(`Find Card Add`);
            await this.paymentOperator.init(paymentCard.enterpriseId)

            const requestCardAdd: reqCardAdd = {
                brand: paymentCard.brand,
                cardNumber: paymentCard.cardNumber,
                customerName: paymentCard.customerName,
                expirationDate: paymentCard.expirationDate,
                holder: paymentCard.holder,
            };

            const response: any = await this.paymentOperator.cardAdd(requestCardAdd)

            if (response?.err == true)
                return response

            if (!response?.cardToken)
                return new Error('Cannot instance Card');

            return await this.paymentCardRepository.persist({
                ...paymentCard,
                token: response.cardToken,
                lastFourNumbers: paymentCard.cardNumber.slice(-4),
            });
        } catch (error) {
            console.log(error)
        }
    };
}
