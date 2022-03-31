import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import createHash from './createHash';

const schedulingRecurrence = async (payload: TInvoice) => {
    console.log('schedulingRecurrence', payload);

    const linkInvoice: TLinkInvoice = await createHash(
        Number(payload.invoiceId),
    );

    const returnTopic = (
        response: any,
        err: boolean = false,
        message: string = 'Success',
    ) => {
        return {
            status: err ? 422 : 200,
            err,
            ...(message ? { message } : {}),
            data: {
                createInvoice: {
                    ...(payload ? { ...payload } : {}),
                    returnOpah: {
                        err,
                        spotInvoice: true,
                        anticipation: false,
                        firstPayment: false,
                        type: payload.type,
                        status: err ? 'failed' : 'success',
                        messageError: message || undefined,
                        ...(message ? { message } : {}),
                        ...(response ? { ...response } : {}),
                        linkInvoice,
                    },
                },
            },
        };
    };

    try {
        if (linkInvoice.err)
            return returnTopic(
                {
                    message: 'error generating hash for link',
                },
                true,
            );
        /*
            obs: if (req.createInvoice?.type == EnumInvoiceType.booking) {

            .firstPayment - determina quando a fatura sera uma spot ou primeiro pagamento
                firstPayment = true = primeiro pagamento
                firstPayment = false = uma fatura spot
            .antecipation - determina caso seja uma antecipacao
        */

        /* 

            return {
            err: true,
            data: {
                // resposta de erro
            }
            }

        */
        return returnTopic({
            message: 'Invoice successfully added',
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { schedulingRecurrence };
