type TCancelContract = {
    cancelContract: {
        residentId: number;
        description: string;
        unitId: number;
        entrepriseId: number;
        finishDate: Date; //timestamp;
    };
};

const cancelContract = async (req: any) => {
    const payload: TCancelContract = req;

    const returnTopic = (
        response: any,
        error: boolean = false,
        message: string = 'Success',
    ) => {
        return {
            error,
            ...(message ? { message } : {}),
            cancelContract: {
                ...(payload ? { payload } : {}),
                returnOpah: {
                    ...(response ? { response } : {}),
                    ...(message ? { message } : {}),
                },
            },
        };
    };

    try {
        console.log('cancelContract ::', payload);
        /* 

            response 
                cancelContract: {
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
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { cancelContract };
