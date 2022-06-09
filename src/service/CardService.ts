import debug from 'debug';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';
import CryptIntegrationGateway from '../dataProvider/gateway/CryptIntegrationGateway';
import { rError, rSuccess } from '../utils';
import { TFindExistsFilter } from '../domain/Payment';

export default class CardService {
    private logger = debug('payment-api:CardService');
    private paymentCardRepository = new PaymentCardsRepository();
    private cryptIntegrationGateway = new CryptIntegrationGateway();

    public findResidentId = async (
        enterpriseId: number,
        residentId: number,
    ) => {
        try {
            this.logger(`Find Find Card`);
            const filter: TFindExistsFilter = {
                residentId,
                enterpriseId,
            };

            const cardExists: any = await this.paymentCardRepository.findExists(
                filter,
            );

            if (cardExists?.err) return cardExists;

            if (!cardExists?.data?.row)
                return rError({
                    message: 'card already registered in the database',
                });

            const securityCode: any =
                await this.cryptIntegrationGateway.decryptData(
                    String(cardExists.data?.row?.hash),
                );

            const cardNumber = await this.cryptIntegrationGateway.decryptData(
                String(cardExists.data?.row?.hashC),
            );

            return rSuccess({
                message: 'data processed successfully',
                ...cardExists?.data?.row,
                securityCode,
                cardNumber,
            });
        } catch (error) {
            console.log(77, error);
            return { err: true, data: error };
        }
    };
}
