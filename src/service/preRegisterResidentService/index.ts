import debug from 'debug';
import { InvoiceRepository } from '../../dataProvider/repository/InvoiceRepository';
import { TInvoice, TInvoiceFilter } from '../../domain/Tegrus/TInvoice';
// import { EnumTopicStatusInvoice } from '../domain/Tegrus/TStatusInvoice';

export default class preRegisterResidentService {
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

    public FindOne = async (invoiceId: number) => {
        this.logger(`Find One Include`);

        // TO-DO

        /* 
            - verificar se existe o pre usuario
            - verificar se existe a fatura 
            - incluir caso nao exista
        */

        // TO-DO
        /* 
            para cpf ja cadastrados buscar o userId
            pelo pre-resident
        */

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

    public FindOneRemove = async (invoiceId: number) => {
        this.logger(`Find One Remove`);

        const resInvoiceId = await this.invoiceRepository.getByInvoiceId(
            invoiceId,
        );

        if (resInvoiceId instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        // TO-DO atualizar a flag active = false
        // const resInvoiceId = await this.invoiceRepository.update();

        return {
            err: false,
            data: resInvoiceId,
        };
    };

    public FindOneInclude = async (invoice: TInvoice) => {
        this.logger(`Find One Include`);

        // TO-DO

        /* 
            - verificar se existe o pre usuario
            - verificar se existe a fatura 
            - incluir caso nao exista
        */

        try {
        } catch (error) {}
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
}
