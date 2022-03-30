import { TExternalPayment } from '../../../../domain/Tegrus/TExternalPayment';
import InvoiceService from '../../../../service/invoiceService';

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
                        messageError: message || undefined,
                        ...(message ? { message } : {}),
                        ...(response ? { ...response } : {}),
                    },
                },
            },
        };
    };

    try {
        console.log('spotInvoiceFine', payload);
        const invoiceService = new InvoiceService();
        const resFindOne: any = await invoiceService.FindOne(payload.invoiceId);
        if (resFindOne.err)
            return returnTopic(
                {
                    messageError: resFindOne?.data?.message,
                },
                true,
            );

        /* 
            atualizar a fatura
        
            {
                "externalPayment": {
                    "invoiceId": "number",
                    "description": "string",
                    "paidAt": "timestamp",
                    "paymentMethod": "'ticket' | 'transfer' | 'credit' 'international_transfer', ‘courtesy’",
                    "status_invoice": "'paid'"
                }
            }

        */

        return returnTopic({
            message: 'Invoice successfully added',
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { externalPayment };
