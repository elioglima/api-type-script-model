import { firstPaymentInvoice } from './firstPaymentInvoice';
import { antecipationInvoice } from './antecipationInvoice';
import { spotInvoice } from './spotInvoice';
import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';

type CreateInvoiceReq = {
    createInvoice?: TInvoice;
};

const createInvoice = async (req: CreateInvoiceReq) => {
    try {
        if (req.createInvoice?.firstPayment == true) {
            /*
                .firstPayment - determina quando a fatura sera uma spot ou primeiro pagamento
                    firstPayment = true = primeiro pagamento
                    firstPayment = false = uma fatura spot
            */
            const response = await firstPaymentInvoice(req.createInvoice);
            return response;
        } else if (req.createInvoice?.anticipation == true) {
            /*
                .antecipation - determina caso seja uma antecipacao
            */
            const response = await spotInvoice(req.createInvoice);
            return response;
        } else if (req.createInvoice?.firstPayment == false) {
            /*
                .firstPayment - determina quando a fatura sera uma spot ou primeiro pagamento
                    firstPayment = true = primeiro pagamento
                    firstPayment = false = uma fatura spot
            */
            const response = await antecipationInvoice(req.createInvoice);
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
