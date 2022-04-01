import debug from 'debug';
import { PaymentCards, TFindExistsFilter } from '../domain/Payment';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';
import { reqCardAdd } from '../domain/IAdapter';
import Adapter from '../domain/Adapter';
import CryptIntegrationGateway from '../dataProvider/gateway/CryptIntegrationGateway';
import { PaymentCardsEntity } from '../dataProvider/entity/PaymentCardsEntity';

export default class CardAddService {
    private logger = debug('payment-api:CardAddService');
    private paymentCardRepository = new PaymentCardsRepository();
    private paymentOperator = new Adapter();
    private cryptIntegrationGateway = new CryptIntegrationGateway();

    public execute = async (paymentCard: PaymentCards) => {
        try {
            this.logger(`Find Card Add`);

            paymentCard.firstFourNumbers = paymentCard.cardNumber.slice(0, 4);
            paymentCard.lastFourNumbers = paymentCard.cardNumber.slice(-4);

            const filter: TFindExistsFilter = {
                userId: paymentCard.userId,
                residentId: paymentCard.residentId,
                enterpriseId: paymentCard.enterpriseId,
                firstFourNumbers: paymentCard.firstFourNumbers,
                lastFourNumbers: paymentCard.lastFourNumbers,
                brand: paymentCard.brand,
            };

            const cardExists = await this.paymentCardRepository.findExists(
                filter,
            );

            if (cardExists instanceof PaymentCardsEntity) {
                return new Error('Card already registered');
            }

            await this.paymentOperator.init(Number(paymentCard?.enterpriseId));

            const requestCardAdd: reqCardAdd = {
                brand: paymentCard.brand,
                cardNumber: paymentCard.cardNumber,
                customerName: paymentCard.customerName,
                expirationDate: paymentCard.expirationDate,
                holder: paymentCard.holder,
            };

            const response: any = await this.paymentOperator.cardAdd(
                requestCardAdd,
            );

            if (response?.err == true) return response;

            if (!response?.cardToken) return new Error('Cannot instance Card');

            paymentCard.hash = await this.cryptIntegrationGateway.encryptData(
                paymentCard.hash,
            );

            paymentCard.hashC = await this.cryptIntegrationGateway.encryptData(
                paymentCard.cardNumber,
            );

            const cardInclude = {
                ...paymentCard,
                token: response.cardToken,
            };

            return await this.paymentCardRepository.FindOneInclude(cardInclude);
        } catch (error) {
            console.log(77, error);
            return { err: true, data: error };
        }
    };
}
