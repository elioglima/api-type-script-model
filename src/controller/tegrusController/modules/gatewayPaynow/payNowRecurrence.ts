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

const returnTopic = (
    response: {
        nextRecurrency: Date | any;
        invoiceId: number;
        paymentDate: Date | any;
        statusInvoice: EnumInvoiceStatus;
        paymentMethod: EnumInvoicePaymentMethod;
        type: EnumInvoiceType;
        message: string;
        receipt?: any;
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
        const recurrenceService = new RecurrenceService();
        const resRecurrenceService = await recurrenceService.FindOneResidentId(
            resident.id,
        );

        console.log(444, resRecurrenceService);
        if (resRecurrenceService?.err)
            return await returnTopic(
                {
                    nextRecurrency: null,
                    paymentDate: null,
                    invoiceId: invoice.invoiceId,
                    statusInvoice: invoice.statusInvoice,
                    paymentMethod: invoice.paymentMethod,
                    type: invoice.type,
                    message: 'error finding recurrence in database',
                },
                true,
            );

        if (resRecurrenceService?.data?.row) {
            // verificar a recorrencia na cielo

            // TO-DO-BETO
            //  CONSULTAR RECORRECIA NA CIELO
            /*
                
                // caso sucesso
                return await returnTopic(
                    {
                        invoiceId: invoice.invoiceId,
                        nextRecurrency: null, // retornar a  proxima recorrencia
                        paymentDate: null, // DATA DO pagamento
                        statusInvoice: invoice.statusInvoice, // status pelo da cielo
                        paymentMethod: invoice.paymentMethod,
                        type: invoice.type,
                        message: 'recurrence is already scheduled',
                    },
                    false,
                );

                */
            return await returnTopic(
                {
                    nextRecurrency: null,
                    paymentDate: null,
                    invoiceId: invoice.invoiceId,
                    statusInvoice: invoice.statusInvoice,
                    paymentMethod: invoice.paymentMethod,
                    type: invoice.type,
                    message: 'recurrence is already scheduled',
                },
                false,
            );
        }

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

        console.log('resRecurrence', resRecurrence);

        if (resRecurrence?.err) {
            return await returnTopic(resRecurrence?.data, true);
        }

        const newStatusInvoice = EnumInvoiceStatus.paid;

        return await returnTopic({
            nextRecurrency: resRecurrence?.data?.nextRecurrency,
            invoiceId: invoice.invoiceId,
            paymentDate: resRecurrence.data.paymentDate,
            statusInvoice: newStatusInvoice,
            paymentMethod: invoice.paymentMethod,
            type: invoice.type,
            message: 'recurrence started successfully',
            receipt: {
                invoiceId: invoice.invoiceId,
                statusInvoice: newStatusInvoice,
                residentName: resident.name,
                enterpriseId: invoice.enterpriseId,
                apartmentId: invoice.apartmentId,
                paymentMethod: invoice.paymentMethod,
                dueDate: invoice.dueDate,
                value: invoice.value,
                tid: resRecurrence.data.tid,
                paymentDate: resRecurrence.data.paymentDate,
                paymentId: resRecurrence.data.paymentId,
                referenceCode: resRecurrence.referenceCode,
                message: resRecurrence.message,
                recurrence: {
                    ...(resRecurrence.data.recurrence
                        ? resRecurrence.data.recurrence
                        : {}),
                },
            },
        });

        // caso nao seja uma recorrencia
        // pagamento cartao de credito
    } catch (error: any) {
        return returnTopic(
            {
                invoiceId: invoice.invoiceId,
                nextRecurrency: null,
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
