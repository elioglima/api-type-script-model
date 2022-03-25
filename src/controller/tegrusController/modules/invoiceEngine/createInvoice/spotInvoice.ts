import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';

const spotInvoice = async (invoice: TInvoice) => {
    try {
        console.log('spotInvoice', invoice);
        /*
            .firstPayment - determina quando a fatura sera uma spot ou primeiro pagamento
                firstPayment = true = primeiro pagamento
                firstPayment = false = uma fatura spot
        */

        /* 

            return {
            err: true,
            data: {
                // resposta de erro
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

export { spotInvoice };
