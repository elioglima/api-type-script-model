import debug from 'debug';
import { PaymentCardsRepository } from '../dataProvider/repository/PaymentCardsRepository';

export default class CardAddService {
    private logger = debug('service-api:CardAddService');
    private paymentCardRepository = new PaymentCardsRepository();

    public execute = async (id: number) => {
        this.logger(`Find Card Add`);
        return this.paymentCardRepository.getById(id).then(
            data => {
                if (data === undefined) {
                    this.logger(`Payment ${id} not found`);
                    return {};
                }

                this.logger(`${data}`);
                return data;
            },
            err => {
                this.logger(`Error: ${err}`);
                return new Error(err);
            },
        );
    };
}
