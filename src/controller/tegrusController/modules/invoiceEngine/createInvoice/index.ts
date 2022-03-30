import { firstPayment } from './firstPayment';
import { invoicing } from './invoicing';
import { antecipationInvoice } from './antecipationInvoice';
import { spotInvoiceFine } from './spotInvoiceFine';
import createHash from './createHash';

import {
    reqCreateHash,
    resCreateHash,
} from '../../../../../domain/Tegrus/TFirstPayment';
import { hashData } from './../../../../../domain/Tegrus/TFirstPayment';
import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { EnumInvoiceType } from '../../../../../domain/Tegrus/EnumInvoiceType';
import { HashDataRepository } from './../../../../../dataProvider/repository/HashDataRepository';
import moment from 'moment';

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

        const HashRep = new HashDataRepository();
        const invoice: TInvoice = req.createInvoice;

        const dataHash: reqCreateHash = {
            invoiceId: invoice.invoiceId,
        };

        const resultHash: resCreateHash = await createHash(dataHash);

        if (resultHash?.err) {
            return {
                err: true,
                data: resultHash,
            };
        }

        if (!resultHash?.hash) {
            return {
                err: true,
                data: {
                    message: 'Error hash not created',
                },
            };
        }

        const hashD: hashData = {
            hash: String(resultHash.hash),
            lifeTime: moment().add('days', 3).toDate(),
            invoiceId: Number(invoice.invoiceId),
        };

        const resHashRep = await HashRep.persist(hashD);

        if (resHashRep?.err) {
            return resHashRep;
        }

        const linkInvoice: TLinkInvoice = {
            invoiceId: invoice.invoiceId,
            hashCredit: resultHash?.hash,
        };

        if (req.createInvoice?.anticipation == true) {
            const response = await antecipationInvoice(
                req.createInvoice,
                linkInvoice,
            );
            return response;
        } else if (req.createInvoice?.type == EnumInvoiceType.booking) {
            const response = await firstPayment(req.createInvoice, linkInvoice);
            return response;
        } else if (
            [EnumInvoiceType.spot, EnumInvoiceType.fine].includes(
                req.createInvoice?.type,
            )
        ) {
            const response = await spotInvoiceFine(
                req.createInvoice,
                linkInvoice,
            );
            return response;
        } else if (req.createInvoice?.type == EnumInvoiceType.rent) {
            const response = await invoicing(req.createInvoice);
            return response;
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
