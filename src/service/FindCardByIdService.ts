import debug from 'debug';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';
import CryptIntegrationGateway from '../dataProvider/gateway/CryptIntegrationGateway';

export class FindCardByIdService {
    private logger = debug('service-api:FindCardByIdService');
    private paymentCardsRepository = new PaymentCardsRepository();
    private cryptIntegrationGateway = new CryptIntegrationGateway();

    public execute = async (cardId: number) => {
        this.logger(`Find card by id`);
        const card = await this.paymentCardsRepository.getById(cardId);

        if (card == undefined) {
            return Error('Card not found');
        }

        if (card.hash)
            card.hash = await this.cryptIntegrationGateway.decryptData(
                String(card.hash),
            );

        if (card.hashC)
            card.hashC = await this.cryptIntegrationGateway.decryptData(String(card.hashC));
            
        return card;
    };
}
