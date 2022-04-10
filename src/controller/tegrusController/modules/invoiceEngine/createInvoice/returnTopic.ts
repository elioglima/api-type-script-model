import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { EnumInvoicePaymentMethod } from '../../../../../domain/Tegrus/EnumInvoicePaymentMethod';

const returnTopic = async (
    request: TInvoice,
    response: any,
    err: boolean = false,
    linkInvoice?: TLinkInvoice | any,
) => {
    return {
        status: err ? 422 : 200,
        err,
        data: {
            createInvoice: {
                ...(request ? { ...request } : {}),
                returnOpah: {
                    err,
                    type: request.type,
                    status: err ? 'failed' : 'success',
                    ...(response ? { ...response } : {}),
                    ...(err
                        ? { messageError: response?.message || undefined }
                        : { message: response.message }),
                    ...(EnumInvoicePaymentMethod.credit == request.paymentMethod
                        ? linkInvoice
                            ? { linkInvoice }
                            : {}
                        : {}),
                },
            },
        },
    };
};

export { returnTopic };
