import { TExternalPayment } from '../../../../domain/Tegrus/TExternalPayment';
import InvoiceService from '../../../../service/invoiceService';
import { TInvoice } from '../../../../domain/Tegrus/TInvoice';

const externalPayment = async (req: any) => {
    const payload: TExternalPayment = req?.externalPayment;

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
                externalPayment: {
                    ...(payload ? { ...payload } : {}),
                    returnOpah: {
                        err,
                        status: err ? 'failed' : 'success',
                        ...(err
                            ? { messageError: message || undefined }
                            : { message }),
                        ...(response ? { ...response } : {}),
                    },
                },
            },
        };
    };

    try {
        console.log('externalPayment', payload);
        const invoiceService = new InvoiceService();
        const resFindOne: any = await invoiceService.FindOne(payload.invoiceId);
        if (resFindOne.err)
            return returnTopic(
                {
                    messageError: resFindOne?.data?.message,
                },
                true,
            );

        const invoice: TInvoice = resFindOne.data;
        const updataData: any = {
            paymentDate: payload?.paiAt,
            paymentMethod: payload?.paymentMethod,
            statusInvoice: payload?.statusInvoice,
        };

        if (invoice.isRecurrence) {
            // TO-DO-NOW
            // desabilitarr recorrencia
        }

        const resUpdateIvoice = await invoiceService.Update(updataData);
        if (resUpdateIvoice.err)
            return returnTopic(
                {
                    message: 'Invoice successfully added',
                },
                true,
            );

        return returnTopic({
            message: 'Invoice successfully added',
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { externalPayment };
