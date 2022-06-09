import debug from 'debug';

import { InvoiceRepository } from '../dataProvider/repository/InvoiceRepository';

export class FindReceiptByPaymentIdService {
    private logger = debug('service-api:FindReceiptByPaymentIdService');

    private invoiceRepository = new InvoiceRepository();

    public execute = async (invoiceId: number) => {
        this.logger(`Find invoice by id`);
        return this.invoiceRepository.getByInvoiceId(invoiceId).then(
            data => {
                if (data === undefined) {
                    this.logger(`Payment ${invoiceId} not found`);
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
