import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';
import createHash from './createHash';

const invoicing = async (payload: TInvoice) => {
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
                        spotInvoice: false,
                        anticipation: false,
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
        console.log('invoicing', payload);
        const invoiceService = new InvoiceService();
        const resFindOneInclude = await invoiceService.FindOne(
            payload.invoiceId,
        );

        if (resFindOneInclude.err)
            return returnTopic(resFindOneInclude.data, false);

        if (payload.isRecurrence == true) {
            // neste caso devemos cadastrar o residente e a fatura
            // regra do roberto
            return returnTopic(resFindOneInclude.data, false);
        }

        return returnTopic({
            message: 'Invoice successfully added ',
            paidAt: 'timestamp',
            amountOfFailure: 'number',
            statusInvoice: "'paid' | 'payment_problem'",
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { invoicing };
