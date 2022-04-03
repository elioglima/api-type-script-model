import debug from 'debug';
import { PaymentCards, TFindExistsFilter } from '../domain/Payment';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';
import { reqCardAdd } from '../domain/IAdapter';
import AdapterPayment from '../domain/AdapterPayment';
import CryptIntegrationGateway from '../dataProvider/gateway/CryptIntegrationGateway';
import { rError, rSuccess } from '../utils';

export default class CardAddService {
    private logger = debug('payment-api:CardAddService');
    private paymentCardRepository = new PaymentCardsRepository();
    private paymentOperator = new AdapterPayment();
    private cryptIntegrationGateway = new CryptIntegrationGateway();

    public execute = async (paymentCard: PaymentCards) => {
        try {
            this.logger(`Find Card Add`);

            if (!paymentCard?.enterpriseId)
                return rError({
                    message: 'business code not informed',
                });

            if (!paymentCard?.userId && !paymentCard?.residentId)
                return rError({
                    message: 'userId or residentId was not informed',
                });

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

            if (cardExists?.err) return cardExists;

            if (cardExists?.data?.row)
                return rSuccess({
                    message: 'card already registered in the database',
                    card: cardExists?.data?.row,
                });

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

            const securityCode: number | string | undefined =
                paymentCard.hash || paymentCard.securityCode;
            if (!securityCode || Number(securityCode) <= 0)
                return new Error('security code not informed');

            paymentCard.hash = await this.cryptIntegrationGateway.encryptData(
                String(securityCode),
            );

            paymentCard.hashC = await this.cryptIntegrationGateway.encryptData(
                paymentCard.cardNumber,
            );

            const cardInclude = {
                ...paymentCard,
                token: response.cardToken,
            };

            const cardDB = await this.paymentCardRepository.FindOneInclude(
                cardInclude,
            );

            if (cardDB?.err)
                return rSuccess({
                    message: 'card already registered in the database',
                    card: cardDB,
                });
        } catch (error) {
            console.log(77, error);
            return { err: true, data: error };
        }
    };
}
