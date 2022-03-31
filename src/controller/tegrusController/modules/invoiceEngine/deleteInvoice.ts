import deactivateRecurrence from '../../../../service/tegrus.services/deactivateRecurrence';

type TDeleteInvoiceData = {
    invoiceId: string;
    description: string;
};

import InvoiceService from '../../../../service/invoiceService';
import { TInvoice } from '../../../../domain/Tegrus';

const deleteInvoice = async (req: any) => {
    const payload: TDeleteInvoiceData = req?.deleteInvoice;

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
                deleteInvoice: {
                    ...(payload ? { ...payload } : {}),
                    returnOpah: {
                        err,
                        ...(message ? { message } : {}),
                        ...(response ? { ...response } : {}),
                    },
                },
            },
        };
    };

    try {
        const invoiceService = new InvoiceService();
        const resInvoice = await invoiceService.FindOne(
            Number(payload.invoiceId),
        );

        if (resInvoice?.err)
            return returnTopic(
                { message: 'Failed to disable invoice deletion' },
                true,
            );

        const invoice: TInvoice = resInvoice.data;
        const resDeactivateRecurrence = await deactivateRecurrence(invoice);

        if (resDeactivateRecurrence?.err)
            return returnTopic(
                {
                    message:
                        resDeactivateRecurrence?.data?.message ||
                        'unexpected error, when canceling recurrence in cielo',
                },
                true,
            );

        const resFindOneDisabled = await invoiceService.FindOneDisabled(
            invoice.invoiceId,
        );

        if (resFindOneDisabled?.err)
            return returnTopic(
                { message: 'Failed to disable invoice deletion' },
                true,
            );

        if (resFindOneDisabled.err)
            return returnTopic(resFindOneDisabled.data, true);

        return returnTopic(resFindOneDisabled.data);
    } catch (error: any) {
        return returnTopic(
            { message: error.message || 'unexpected error' },
            true,
        );
    }
};

export { deleteInvoice };
