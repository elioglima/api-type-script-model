import { TStatusInvoiceData } from '../../../../domain/Tegrus/TStatusInvoice';
import InvoiceService from '../../../../service/invoiceService';

const statusInvoice = async (toReceive: any) => {
    const listInvoices: TStatusInvoiceData[] = toReceive?.statusInvoice;

    try {
        console.log('statusInvoice', listInvoices);

        const results: any = listInvoices.map(async m => {
            try {
                /*

                    TO-DO
                    - pesquisar as faturas 
                    - pesquisar se a recorrencia vigente pelo recorrenceDate na cielo foi efetiva
                */

                const invoiceService = new InvoiceService();
                const resFindOne: any = await invoiceService.FindOne(
                    m.invoiceId,
                );

                if (resFindOne.err)
                    return {
                        invoiceId: resFindOne.invoiceId,
                        statusInvoice: resFindOne.statusInvoice,
                        paymentMethod: resFindOne.paymentMethod,
                        // “paymentDate”: “10/02/2022 23:02”, // data vinda da cielo
                        messageError: 'Invoice not found',
                    };

                // pegar esta data do endpoint de consulta recorrencia vigente
                const paymentDate = new Date();

                // atualizar a invoice
                // paymentDate

                return {
                    invoiceId: resFindOne.invoiceId,
                    statusInvoice: resFindOne.statusInvoice,
                    paymentMethod: resFindOne.paymentMethod,
                    paymentDate,
                    messageError: 'Invoice not found',
                };
            } catch (error: any) {
                console.log(error);
                return {
                    invoiceId: m.invoiceId,
                    messageError: 'unexpected error',
                };
            }
        });

        return {
            invoices: results,
        };
    } catch (error: any) {
        console.log(error);
        return {
            err: true,
            data: {
                message: 'unexpected error',
            },
        };
    }
};

export { statusInvoice };
