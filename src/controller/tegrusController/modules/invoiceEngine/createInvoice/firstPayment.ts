import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';

const firstPayment = async (invoice: TInvoice, linkInvoice: TLinkInvoice) => {
    try {
        console.log('firstPayment', invoice, linkInvoice);
        /*
            obs: if (req.createInvoice?.type == EnumInvoiceType.booking) {

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
            }
            }

        */
        return {
            err: false,
            // data: statusInvoice: {
            //     invoiceId: number,
            //     description: string,
            //     paidAt: timestamp,
            //     paymentMethod: 'ticket' | 'transfer' | 'credit' 'international_transfer', ‘courtesy’
            //     amountOfFailure: number,
            //     statusInvoice: 'paid' | 'payment_problem'
            // }
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

export { firstPayment };
