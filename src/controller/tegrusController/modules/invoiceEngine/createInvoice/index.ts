import { booking } from './booking';
import { invoicing } from './invoicing';
import { antecipationInvoice } from './antecipationInvoice';
import { spotInvoiceFine } from './spotInvoiceFine';

import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { EnumInvoiceType } from '../../../../../domain/Tegrus/EnumInvoiceType';
import { returnTopic } from './returnTopic';

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

        // validates
        if (!invoice?.resident)
            returnTopic(
                invoice,
                { message: 'Resident was not informed' },
                true,
            );

        if (
            [EnumInvoiceType.spot].includes(invoice?.type) &&
            invoice?.anticipation == true
        ) {
            return await antecipationInvoice(invoice);
        } else if (invoice?.type == EnumInvoiceType.booking) {
            return await booking(invoice);
        } else if (
            invoice?.type == EnumInvoiceType.rent &&
            invoice.isRecurrence
        ) {
            return await booking(invoice);
        } else if (
            [EnumInvoiceType.spot, EnumInvoiceType.fine].includes(invoice?.type)
        ) {
            return await spotInvoiceFine(invoice);
        } else if (invoice?.type == EnumInvoiceType.rent) {
            return await invoicing(invoice);
        } else {
            /*
                apenas uma emissao de faturas
            */
            // const response = await invoicing(req.createInvoice);
            // return response;
        }

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
