import { defaultReturnMessage } from './../../../../utils/returns';
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
import InvoiceService from '../../../../service/invoiceService';

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
        const invoiceService = new InvoiceService();
        const recurrenceService = new RecurrenceService();
        const resRecurrenceService = await recurrenceService.FindOneResidentId(
            resident.id,
        );

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

        console.log(123, resRecurrence);

        if (resRecurrence?.err) {
            return await returnTopic(
                {
                    invoiceId: invoice.invoiceId,
                    ...resRecurrence?.data,
                },
                true,
            );
        }

        const newStatusInvoice = EnumInvoiceStatus.paid;
        const updateInvoiceData: TInvoice = {
            ...invoice,
            statusInvoice: newStatusInvoice,
            paymentDate: resRecurrence.data.paymentDate,
        };

        const returnCode = resRecurrence?.data?.returnCode;

        const { code, message }: any = defaultReturnMessage(returnCode);
        console.log(code, message);
        console.log(999, 'resRecurrence', resRecurrence?.data);
        console.log(77777, resident);

        let referenceCode = code;
        if (referenceCode == 1) {
            const resUpdate: any = await invoiceService.Update(updateInvoiceData);
            if (resUpdate.err)
                return await returnTopic(
                    {
                        invoiceId: invoice.invoiceId,
                        ...resUpdate.data,
                    },
                    true,
                );
        }

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
                statusInvoice:
                    referenceCode == 1
                        ? newStatusInvoice
                        : invoice.statusInvoice,

                paymentDate: resRecurrence?.data?.paymentDate,
                tid: resRecurrence?.data?.tid,
                dueDate: invoice?.dueDate,
                residentName: resident?.name,
                residentEmail: resident.email,
                residentDocumentType: resident.documentType,
                residentDocument: resident.document,

                enterpriseId: invoice?.enterpriseId,
                apartmentId: invoice?.apartmentId,
                paymentMethod: invoice?.paymentMethod,
                startReferenceDate: invoice?.startReferenceDate,
                endReferenceDate: invoice?.endReferenceDate,
                referenceCode,
                message,

                value: invoice?.value,
                totalValue: invoice?.totalValue,
                tax: invoice?.tax,
                refund: invoice?.refund,
                expense: invoice?.expense,
                fine: invoice?.fine,
                discount: invoice?.discount,
                condominium: invoice?.condominium,
                fineTicket: invoice?.fineTicket,
                stepValue: invoice?.stepValue,
                commission: invoice?.commission,

                recurrence: {
                    ...(resRecurrence?.data?.recurrence
                        ? resRecurrence?.data?.recurrence
                        : {}),
                },
            },
        });
    } catch (error: any) {
        console.log(777, error);
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
