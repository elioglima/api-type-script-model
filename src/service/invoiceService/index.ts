import debug from 'debug';
import { InvoiceRepository } from '../../dataProvider/repository/InvoiceRepository';
import { TInvoice, TInvoiceFilter } from '../../domain/Tegrus/TInvoice';

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

    public FindOneResidentId = async (residentId: number) => {
        this.logger(`Find One ResidentID`);
        
        const resInvoiceId = await this.invoiceRepository.getByResidentId(
            residentId,
        );

        if (resInvoiceId instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'no invoice found',
                },
            };
        }

        return {
            err: false,
            data: resInvoiceId,
        };
    };

    public FindOne = async (invoiceId: number) => {
        this.logger(`Find One Include`);

        const resInvoiceId = await this.invoiceRepository.getByInvoiceId(
            invoiceId,
        );

        if (resInvoiceId instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'no invoice found',
                },
            };
        }

        return {
            err: false,
            data: resInvoiceId,
        };
    };

    public FindOneDisabled = async (invoiceId: number) => {
        this.logger(`Find One FindOneDisabled`);

        const resInvoiceId: TInvoice =
            await this.invoiceRepository.getByInvoiceId(invoiceId);

        if (resInvoiceId instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        const resInvoiceUpdate: TInvoice = await this.invoiceRepository.update({
            ...resInvoiceId,
            invoiceId: invoiceId,
            active: false,
        });

        if (resInvoiceUpdate instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        return {
            err: false,
            data: resInvoiceId,
        };
    };

    public FindOneInclude = async (invoice: TInvoice) => {
        this.logger(`Find One Include`);

        const resInvoiceId = await this.invoiceRepository.getByInvoiceId(
            invoice.invoiceId,
        );

        if (resInvoiceId) {
            // fatura existe
            return {
                err: true,
                data: {
                    message: 'Invoice is already processed',
                },
            };
        }

        const resPersist = await this.invoiceRepository.persist(invoice);
        if (resPersist instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        return {
            err: false,
            data: resPersist,
        };
    };

    public Find = async (payload: TInvoiceFilter) => {
        this.logger(`Find`);

        const resInvoiceFind: any = await this.invoiceRepository.Find(payload);
        if (resInvoiceFind instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        if (resInvoiceFind.err) return resInvoiceFind;
        return {
            err: false,
            data: resInvoiceFind,
        };
    };

    public Update = async (payload: TInvoice) => {
        this.logger(`Update`);

        const resInvoiceUpdate: any = await this.invoiceRepository.update(
            payload,
        );

        if (resInvoiceUpdate instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        if (resInvoiceUpdate.err) return resInvoiceUpdate;
        return {
            err: false,
            data: resInvoiceUpdate,
        };
    };
}
