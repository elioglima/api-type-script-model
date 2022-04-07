import InvoiceService from '../../../../service/invoiceService';
import { EnumInvoiceStatus } from '../../../../domain/Tegrus/EnumInvoiceStatus';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
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
        [x: string]: any;
    },
    err: boolean = false,
) => {
    const { message, ...respData } = response;
    return {
        err,
        message,
        statusInvoice: {
            invoices: [
                {
                    ...respData,
                    ...(err
                        ? {
                              messageError:
                                  response?.message || 'unexpected error',
                          }
                        : { message }),
                },
            ],
        },
    };
};

export const payNowCredit = async (
    payload: TPayNowReq,
    invoice: TInvoice,
    resident: TResident,
) => {
    try {
        //

        if (['00', '4'].includes(String(invoice?.returnCode))) {
            // verificando se esta paga a fatura
            return returnTopic({
                message: 'invoice payment has already been changed',
                invoiceId: invoice.invoiceId,
                paymentDate: invoice.paymentDate,
                statusInvoice: invoice.statusInvoice,
                paymentMethod: invoice.paymentMethod,
                type: invoice.type,
                returnMessage: invoice.returnMessage,
                paymentId: invoice.paymentId,
                tid: invoice.tid,
                returnCode: invoice.returnCode,
                referenceCode: 1,
            });
        }

        const invoiceService = new InvoiceService();

        const resPayAdapter: any = await payAdatpter(
            resident,
            {
                ...payload.card,
                hash: payload.card?.securityCode,
            },
            invoice,
            true,
        );

        let referenceCode = 7; // fazer tratativa de verificacao dos codigos
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
                    referenceCode,
                },
                true,
            );

        const paymentDate: Date =
            resPayAdapter?.payment?.receivedDate || new Date(); // so de exemplo
        const newStatusInvoice = EnumInvoiceStatus.paid; // so de exemplo

        const updateInvoice: TInvoice = {
            ...invoice,
            paymentDate,
            statusInvoice: newStatusInvoice,
            returnMessage: resPayAdapter.data.payment.returnMessage,
            paymentId: resPayAdapter.data.payment.paymentId,
            tid: resPayAdapter.data.payment.tid,
            returnCode: resPayAdapter.data.payment.returnCode,
            referenceCode,
        };

        const resUpdate: any = await invoiceService.Update(updateInvoice);
        if (resUpdate.err)
            return returnTopic(
                {
                    invoiceId: invoice.invoiceId,
                    paymentDate: null,
                    statusInvoice: invoice.statusInvoice,
                    paymentMethod: invoice.paymentMethod,
                    type: invoice.type,
                    message: 'internal error updating invoice',
                    referenceCode,
                },
                true,
            );

        return returnTopic({
            invoiceId: invoice.invoiceId,
            paymentDate,
            statusInvoice: newStatusInvoice,
            paymentMethod: invoice.paymentMethod,
            type: invoice.type,
            message: 'successful payment',
            returnMessage: resPayAdapter?.data?.payment?.returnMessage,
            paymentId: resPayAdapter.data.payment.paymentId,
            tid: resPayAdapter.data.payment.tid,
            returnCode: resPayAdapter.data.payment.returnCode,
            referenceCode,
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
                referenceCode: 7,
            },
            true,
        );
    }
};
