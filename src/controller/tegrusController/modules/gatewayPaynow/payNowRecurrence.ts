import { EnumInvoiceStatus } from '../../../../domain/Tegrus/EnumInvoiceStatus';
import {
    TInvoice,
    TResident,
    TRecurrenceSchedule,
} from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';

import RecurrenceService from '../../../../service/recurrenceService';
import { TPayNowReq } from '../../../../domain/Tegrus';
import { payAdatpter } from './payAdatpter';

const returnTopic = (
    response: {
        invoiceId: number;
        paymentDate: Date | any;
        statusInvoice: EnumInvoiceStatus;
        paymentMethod: EnumInvoicePaymentMethod;
        type: EnumInvoiceType;
        message: string;
    },
    err: boolean = false,
) => {
    return {
        err,
        status: err ? 422 : 200,
        statusInvoice: {
            invoices: [
                {
                    ...response,
                    ...(err
                        ? {
                              messageError: err
                                  ? response?.message || 'unexpected error'
                                  : undefined,
                          }
                        : { message: response.message }),
                },
            ],
        },
    };
};

export const payNowRecurrence = async (
    payload: TPayNowReq,
    invoice: TInvoice,
    resident: TResident,
) => {
    try {
        // efetuar o pagamento
        console.log('payNowRecurrence', payload);
        const resPayAdapter: any = await payAdatpter(resident, {
            ...payload.card,
            hash: payload.card?.securityCode,
        });

        if (resPayAdapter?.err)
            return returnTopic(
                {
                    invoiceId: invoice.invoiceId,
                    paymentDate: null,
                    statusInvoice: invoice.statusInvoice,
                    paymentMethod: invoice.paymentMethod,
                    type: invoice.type,
                    message:
                        resPayAdapter?.data?.message ||
                        resPayAdapter?.data?.messageError,
                },
                true,
            );

        if (invoice.isRecurrence == true) {
            const recurrenceService = new RecurrenceService();
            const resRecurrenceService =
                await recurrenceService.FindOneResidentId(resident.id);

            if (resRecurrenceService?.err)
                return await returnTopic(
                    {
                        invoiceId: invoice.invoiceId,
                        paymentDate: null,
                        statusInvoice: invoice.statusInvoice,
                        paymentMethod: invoice.paymentMethod,
                        type: invoice.type,
                        message: 'error finding recurrence in database',
                    },
                    true,
                );

            if (resRecurrenceService?.data?.row)
                return await returnTopic(
                    {
                        invoiceId: invoice.invoiceId,
                        paymentDate: null,
                        statusInvoice: invoice.statusInvoice,
                        paymentMethod: invoice.paymentMethod,
                        type: invoice.type,
                        message: 'recurrence is already scheduled',
                    },
                    false,
                );

            const startDateContract = invoice.referenceDate;
            const endDateContract = new Date(resident.endDateContract);

            const payloadRecurrence: TRecurrenceSchedule = {
                startDateContract,
                endDateContract,
            };

            const resRecurrence = await recurrenceService.ScheduleRecurrence(
                resident,
                invoice,
                payloadRecurrence,
                payload.card,
            );

            if (resRecurrence?.err) {
                return await returnTopic(resRecurrence?.data, true);
            }

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

            const paymentDate: Date = new Date(resRecurrence?.data?.paidAt);
            const newStatusInvoice = EnumInvoiceStatus.issued;

            return await returnTopic({
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
