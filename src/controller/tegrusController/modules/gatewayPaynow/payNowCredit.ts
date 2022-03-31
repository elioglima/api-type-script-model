import { EnumBrands } from '../../../../enum/BrandsEnum';
import { EnumTopicStatusInvoice } from '../../../../domain/Tegrus/TStatusInvoice';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
// import CardAddService from '../../../../service/CardAddService';

export type TReq = {
    hash: string;
    card: {
        cardNumber: string;
        brand: EnumBrands;
        customerName: string;
        expirationDate: string;
        holder: string;
    };
};

const returnTopic = (
    response: {
        invoiceId: number;
        paymentDate: Date | any;
        statusInvoice: EnumTopicStatusInvoice;
        paymentMethod: EnumInvoicePaymentMethod;
        type: EnumInvoiceType;
        message: string;
    },
    err: boolean = false,
) => {
    return {
        statusInvoice: {
            invoices: [
                {
                    invoiceId: 125,
                    messageError: err
                        ? response?.message || 'unexpected error'
                        : undefined,
                },
            ],
        },
    };
};

export const payNowCredit = (
    payload: TReq,
    invoice: TInvoice,
    resident: TResident,
) => {
    try {
        // salvar dados do cartao de credito na base de dados
        // o codigo de seguranca e numero cartao criptogracado na funcao existente

        
        /* 
            - verificar se ha recorrencia vigente
                - caso tenha cancelar a recorrencia e efetuar o pagamento

            - efetuar pagamento pelo adapter
            - atualizar a fatura
                - status
                - dados de cartao
        */
        console.log({ payload, invoice, resident });

        const paymentDate: Date = new Date(); // so de exemplo
        const newStatusInvoice = EnumTopicStatusInvoice.paid; // so de exemplo

        return returnTopic({
            invoiceId: invoice.invoiceId,
            paymentDate,
            statusInvoice: newStatusInvoice,
            paymentMethod: invoice.paymentMethod,
            type: invoice.type,
            message: 'recurrence started successfully',
        });
    } catch (error: any) {
        return returnTopic(
            {
                invoiceId: invoice.invoiceId,
                paymentDate: null,
                statusInvoice: invoice.statusInvoice,
                paymentMethod: invoice.paymentMethod,
                type: invoice.type,
                message: error?.message,
            },
            true,
        );
    }
};
