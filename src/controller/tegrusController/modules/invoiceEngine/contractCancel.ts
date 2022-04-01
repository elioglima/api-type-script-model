import ResidentService from '../../../../service/residentService';
import InvoiceService from 'src/service/invoiceService';
// import InvoiceService from '../../../../service/invoiceService'

type TContractCancel = {
    contractCancel: {
        residentId: number;
        description: string;
        unitId: number;
        entrepriseId: number;
        finishDate: Date; //timestamp;
    };
};

const contractCancel = async (req: any) => {
    const payload: TContractCancel = req;

    const returnTopic = (response: any, err: boolean = false) => {
        return {
            status: err ? 422 : 200,
            err,
            contractCancel: {
                ...(payload ? { ...payload } : {}),
                returnOpah: {
                    ...(response ? { response } : {}),
                    ...(err ? { messageError: response.message } : {}),
                },
            },
        };
    };

    try {
        console.log('contractCancel ::', payload);
        const residentService = new ResidentService();
        const resResident = await residentService.FindOne(
            payload.contractCancel.residentId,
        );

        if (resResident?.err)
            return returnTopic({ message: 'resident not located' }, true);

        const invoiceService = new InvoiceService();
        const resInvoice = await invoiceService.FindOneResidentId(
            payload.contractCancel.residentId,
        );

        console.log(resInvoice);

        if (resInvoice?.err)
            return returnTopic({ message: 'resident not located' }, true);

        /* 

            response 
                contractCancel: {
                    residentId: number
                    description: string
                    unitId: number
                    entrepriseId: number
                    finishDate: timestamp
                }

            obs: criar type enum no statusInvoice: 'canceled' | 'issued' | 'paid' da tabela invoice
            
            1 - verificar se o invoiceId existe na base caso nao retornar erro
            2 - acessar servico de cancelamento do periodo da recorrencia
                caso erro retornar erro
            3 - modificar o status da invoice
                statusInvoice: 'canceled' | 'issued' | 'paid'

            - responta de erro 
                return returnTopic({
                    ... payload do erro aqui
                }, true, 'mensagem do erro');
        */
        return returnTopic(payload);
    } catch (error: any) {
        return returnTopic(
            { message: error?.message || 'Erro inesperado' },
            true,
        );
    }
};

export { contractCancel };
