import debug from 'debug';

import { InvoiceRepository } from '../dataProvider/repository/InvoiceRepository';

export class FindReceiptByPaymentIdService {
    private logger = debug('service-api:FindReceiptByPaymentIdService');

    private invoiceRepository = new InvoiceRepository();

    public execute = async (paymentId: number) => {
        this.logger(`Find payment by id`);
        return this.invoiceRepository.getByPaymentId(paymentId).then(
            data => {
                if (data === undefined) {
                    this.logger(`Payment ${paymentId} not found`);
                    return {};
                }

                this.logger(`${data}`);
                return data;
            },
            (err: string | undefined) => {
                this.logger(`Error: ${err}`);
                return new Error(err);
            },
        );
    };
}
