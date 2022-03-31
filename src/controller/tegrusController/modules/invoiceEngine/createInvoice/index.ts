import { schedulingRecurrence } from './schedulingRecurrence';
import { invoicing } from './invoicing';
import { antecipationInvoice } from './antecipationInvoice';
import { spotInvoiceFine } from './spotInvoiceFine';
import createHash from './createHash';

import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { EnumInvoiceType } from '../../../../../domain/Tegrus/EnumInvoiceType';

type CreateInvoiceReq = {
    createInvoice?: TInvoice;
};

const createInvoice = async (req: CreateInvoiceReq) => {
    try {
        if (!req.createInvoice) {
            return {
                err: true,
                status: 422,
                data: {
                    message: 'Tag createInvoice not found',
                },
            };
        }

        const invoice: TInvoice = req.createInvoice;

        if (
            [EnumInvoiceType.spot].includes(invoice?.type) &&
            invoice?.anticipation == true
        ) {
            return await antecipationInvoice(invoice, createHash);
        } else if (
            invoice?.type == EnumInvoiceType.booking &&
            invoice.isRecurrence
        ) {
            return await schedulingRecurrence(invoice, createHash);
        } else if (
            [EnumInvoiceType.spot, EnumInvoiceType.fine].includes(invoice?.type)
        ) {
            return await spotInvoiceFine(invoice, createHash);
        } else if (invoice?.type == EnumInvoiceType.rent) {
            return await invoicing(invoice);
        } else {
            /*
                apenas uma emissao de faturas
            */
            // const response = await invoicing(req.createInvoice);
            // return response;
        }

        /* 

            return {
            err: true,
            data: {
                // resposta de erro
            }
            }

        */
        return {
            err: false,
            data: {
                // resposta de sucesso
            },
        };
    } catch (error: any) {
        console.log(error);
        return {
            err: true,
            data: {
                message: error?.message || 'Erro inesperado',
            },
        };
    }
};

export { createInvoice };
