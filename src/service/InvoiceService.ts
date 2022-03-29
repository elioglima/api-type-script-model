import debug from 'debug';
import { InvoiceRepository } from '../dataProvider/repository/InvoiceRepository';
import { TInvoice } from '../domain/Tegrus/TInvoice';

export default class InvoiceService {
    private logger = debug('payment-api:InvoiceService');
    private invoiceRepository = new InvoiceRepository();

    public getAll = async () => {
        this.logger(`Find All invoices`);
        const data = await this.invoiceRepository.getAll();

        if (data == undefined) {
            return new Error('Invoices not found');
        }
        return data;
    };

    public FindOneInclude = async (invoice: TInvoice) => {
        this.logger(`Find One Include`);

        // TO-DO

        /* 
            - verificar se existe o pre usuario
            - verificar se existe a fatura 
            - incluir caso nao exista
        */

        const data = await this.invoiceRepository.getById(invoice.residentId);

        console.log({ data });

        if (data == undefined) {
            return new Error('FindOneInclude not found');
        }
        return data;
    };
}
