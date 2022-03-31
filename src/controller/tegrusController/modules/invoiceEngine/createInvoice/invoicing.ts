import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';
import { EnumInvoicePaymentMethod } from '../../../../../domain/Tegrus/EnumInvoicePaymentMethod';

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

        console.log(123, resFindOneInclude);

        if (
            [EnumInvoicePaymentMethod.ticket].includes(payload.paymentMethod) &&
            resFindOneInclude.err
        ) {
            // neste caso devemos cadastrar o residente e a fatura

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
