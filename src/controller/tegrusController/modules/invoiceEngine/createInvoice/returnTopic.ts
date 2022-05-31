import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { EnumInvoicePaymentMethod } from '../../../../../domain/Tegrus/EnumInvoicePaymentMethod';

const returnTopic = async (
    request: TInvoice,
    response: any,
    err: boolean = false,
    linkInvoice?: TLinkInvoice | any,
) => {
    const { message, ...resp } = response;
    return {
        status: err ? 422 : 200,
        err,
        data: {
            createInvoice: {
                ...(request ? { ...request } : {}),
                returnOpah: {
                    err,
                    ...(resp ? { ...resp } : {}),
                    ...(err
                        ? { messageError: message || undefined }
                        : { message }),
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
