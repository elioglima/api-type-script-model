// import InvoiceService from '../../../../../service/InvoiceService';
type TDeleteInvoiceData = {
    invoiceId: string;
    description: string;
};

import InvoiceService from '../../../../service/invoiceService';

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
        const resFindOneInclude = await invoiceService.FindOneDisabled(
            Number(payload.invoiceId),
        );
        if (resFindOneInclude.err)
            return returnTopic(resFindOneInclude.data, true);

        return returnTopic(resFindOneInclude.data);
    } catch (error: any) {
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { deleteInvoice };
