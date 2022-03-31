import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';

const spotInvoiceFine = async (payload: TInvoice, createHash: Function) => {
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

    if (linkInvoice.err)
        return returnTopic(
            {
                message: 'error generating hash for link',
            },
            true,
        );

    try {
        console.log('spotInvoiceFine', payload);

        const invoiceService = new InvoiceService();
        const resFindOneInclude = await invoiceService.FindOneInclude(payload);
        if (resFindOneInclude.err)
            return returnTopic(resFindOneInclude.data, true);

        return returnTopic({
            message: 'Invoice successfully added',
            resident: resFindOneInclude,
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { spotInvoiceFine };
