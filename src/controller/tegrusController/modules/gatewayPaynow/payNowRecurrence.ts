import { EnumTopicStatusInvoice } from '../../../../domain/Tegrus/TStatusInvoice';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';

import { TPayNowReq } from './TPayNow';

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

export const payNowRecurrence = (
    payload: TPayNowReq,
    invoice: TInvoice,
    resident: TResident,
) => {
    try {
        // salvar dados do cartao de credito na base de dados
        // o codigo de seguranca e numero cartao criptogracado na funcao existente

        if (invoice.isRecurrence == true) {
            // iniciar recorrencia e procedimentos normais
            console.log({ payload, invoice, resident });

            /*
            para agendamento da recorrencia
                - caso exista este dados utilizalos como base para gerar
                    - startReferenceDate: Date; ou data de hoje = new Date()
                    - endReferenceDate: Date; ou endDateContract: string;
                - caso nao exista utilizar
                    startDateContract: string; ou data de hoje = new Date()
                    endDateContract: string; 

                -- caso nao exista endDateContract ou endReferenceDate nao gerar recorrencia
                    -- retornar erro informando que a recorrencia nao foi iniciada
                    
                    
            - apos fazer a recorrencia guardar os dados
                - paymentDate
                - recurrenceId
                - atualizar o status na fatura como paid


            - modelo de retorno error
            return returnTopic({
                message: 'something went wrong, recurrence not started.',
            }, true);
        */

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
        }

        // caso nao seja uma recorrencia
        // pagamento cartao de credito
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
