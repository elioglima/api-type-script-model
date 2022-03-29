import { firstPayment } from './firstPayment';
import { invoicing } from './invoicing';
import { antecipationInvoice } from './antecipationInvoice';
import { spotInvoice } from './spotInvoice';
import {
    TInvoice,
    EnumInvoiceType,
} from '../../../../../domain/Tegrus/TInvoice';

type CreateInvoiceReq = {
    createInvoice?: TInvoice;
};

const createInvoice = async (req: CreateInvoiceReq) => {
    try {
        if (!req.createInvoice) {
            return {
                err: true,
                data: {
                    message: 'Tag createInvoice not found',
                },
            };
        }

        if (req.createInvoice?.type == EnumInvoiceType.booking) {
            /*
                - area logada
                .firstPayment - determina quando a fatura sera uma spot ou primeiro pagamento
                    firstPayment = true = primeiro pagamento
                    firstPayment = false = uma fatura spot
            */
            const response = await firstPayment(req.createInvoice);
            return response;
        } else if (req.createInvoice?.type == EnumInvoiceType.spot) {
            /*
                .firstPayment - determina quando a fatura sera uma spot ou primeiro pagamento
                firstPayment = true = primeiro pagamento
                firstPayment = false = uma fatura spot
            */

            const response = await spotInvoice(req.createInvoice);
            return response;
        } else if (req.createInvoice?.anticipation == true) {
            /*
                .antecipation - determina caso seja uma antecipacao
            */
            const response = await antecipationInvoice(req.createInvoice);
            return response;
        } else {
            /*
                apenas uma emissao de faturas
            */
            const response = await invoicing(req.createInvoice);
            return response;
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
        return {
            err: true,
            data: {
                message: error?.message || 'Erro inesperado',
            },
        };
    }
};

export { createInvoice };
