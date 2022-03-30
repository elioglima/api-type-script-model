import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';

const invoicing = async (payload: TInvoice) => {
    const returnTopic = (
        response: any,
        err: boolean = false,
        message: string = 'Success',
        status = 200,
    ) => {
        return {
            status: err ? 422 : status,
            err,
            ...(message ? { message } : {}),
            data: {
                createInvoice: {
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
        console.log('invoicing', payload);
        const invoiceService = new InvoiceService();
        const resFindOneInclude = await invoiceService.FindOne(
            payload.invoiceId,
        );

        if (resFindOneInclude.err)
            return returnTopic(resFindOneInclude.data, false);

        // verificar recorrencia vigente
        // retornar para tegrus
        // pago ou nao pago

        return returnTopic({
            message: 'Invoice successfully added',
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
