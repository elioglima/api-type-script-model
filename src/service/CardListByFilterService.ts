import debug from 'debug';
import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export default class CardListByFilterService {
    private logger = debug('service-api:CardListByFilterService');
    private paymentRepository = new PaymentRepository();

    public execute = async (id: number) => {
        this.logger(`Find payment by id`);
        return this.paymentRepository.getById(id).then(
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
