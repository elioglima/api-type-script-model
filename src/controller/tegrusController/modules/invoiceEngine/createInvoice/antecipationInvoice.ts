import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';

const antecipationInvoice = async (payload: TInvoice, createHash: Function) => {
    console.log('invoice.antecipation', payload);

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
                        status: err ? 'failed' : 'success',
                        messageError: message || undefined,
                        anticipation: true,
                        spotInvoice: false,
                        firstPayment: false,
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

        const invoiceService = new InvoiceService();
        const resFindOneInclude = await invoiceService.FindOneInclude(payload);
        if (resFindOneInclude.err)
            return returnTopic(resFindOneInclude.data, true);

        // TO-DO
        // pesquisar a recorrencia e paralizala ou remover a do mes vigente
        // "referenceDate": "2022-03-12",

        return returnTopic({
            message: 'Invoice successfully added',
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { antecipationInvoice };
