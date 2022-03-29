import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/InvoiceService';

const spotInvoice = async (payload: TInvoice) => {
    const returnTopic = (
        response: any,
        error: boolean = false,
        message: string = 'Success',
    ) => {
        return {
            error,
            ...(message ? { message } : {}),
            deleteInvoice: {
                ...(payload ? { payload } : {}),
                returnOpah: {
                    ...(response ? { response } : {}),
                    ...(message ? { message } : {}),
                },
            },
        };
    };

    try {
        console.log('spotInvoice', payload);
        const invoiceService = new InvoiceService();
        const resFindOneInclude = await invoiceService.FindOneInclude(payload);
        console.log('resFindOneInclude', resFindOneInclude);

        /*
            Ao receber uma fatura spot e não paga no Pipefy, uma notificação é gerada para o barramento que por sua vez envia uma notificação para o App. Essa fatura deve ser removida do App, não deixando o morador pagar.
            Abaixo o payload de envio da remoção da fatura.

            1 - verificar se o invoiceId existe na base caso nao retornar erro
            2 - acessar servico de cancelamento de recorrencia unica reference dia atual e mes
                caso erro retornar erro

            - responta de erro 
                return returnTopic({
                    ... payload do erro aqui
                }, true, 'mensagem do erro');
        */

        return returnTopic(payload);
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { spotInvoice };
