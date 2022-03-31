import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { EnumInvoicePaymentMethod } from '../../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import createHash from './createHash';
import InvoiceService from '../../../../../service/invoiceService';

const booking = async (payload: TInvoice) => {
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
                        ...(EnumInvoicePaymentMethod.credit ==
                        payload.paymentMethod
                            ? { linkInvoice }
                            : {}),
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
        const resFindOne = await invoiceService.FindOne(payload.invoiceId);

        if (!resFindOne.err)
            return returnTopic({
                message: 'invoice already exists in the database',
            });

        // cadastrar fatura
        // cadastrar residente

        return returnTopic({
            message: 'Invoice successfully added',
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { booking };
