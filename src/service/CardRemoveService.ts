import debug from 'debug';
import { PaymentCardsEntity } from '../dataProvider/entity/PaymentCardsEntity';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';

export default class CardRemoveService {
    private logger = debug('service-api:CardRemoveService');
    private paymentCardsRepository = new PaymentCardsRepository();

    public execute = async (idCard: number) => {
        this.logger(`Find payment by id`);

        const card = await this.paymentCardsRepository.getById(idCard);

        if (card instanceof PaymentCardsEntity) {
            const cardUpdate: any = {
                id: idCard,
                deletedAt: new Date(),
            };

            return await this.paymentCardsRepository.update(cardUpdate);
        } else {
            return new Error('Card not found');
        }
    };
}
