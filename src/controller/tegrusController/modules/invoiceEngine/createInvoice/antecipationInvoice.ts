import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
const antecipationInvoice = async (invoice: TInvoice) => {
    try {
        console.log('antecipationInvoice', invoice);
        /*
            .firstPayment - determina quando a fatura sera uma spot ou primeiro pagamento
                firstPayment = true = primeiro pagamento
                firstPayment = false = uma fatura spot
            .antecipation - determina caso seja uma antecipacao
        */

        /* 

            return {
            err: true,
            data: {
                // resposta de erro
                createInvoice: {

                }
            }
            }

        */
        return {
            err: false,
            data: {
                createInvoice: {
                    ...invoice,
                    returnOpah: {
                        message: 'success',
                    },
                },
            },
        };
    } catch (error: any) {
        return {
            err: true,
            data: {
                message: error?.message || 'Erro inesperado',
            },
        };
    }
};

export { antecipationInvoice };
