import { defaultReturnMessage } from './../../../../utils/returns';
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
    const resMessage: any = defaultReturnMessage(String(invoice?.returnCode));
    try {
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
                paymentId: invoice?.paymentId,
                tid: invoice.tid,
                returnCode: resMessage.code,
                receipt: {
                    referenceCode: 1,
                    tid: invoice.tid,
                    invoiceId: invoice.invoiceId,
                    statusInvoice: invoice.statusInvoice,
                    residentName: resident.name,
                    enterpriseId: invoice.enterpriseId,
                    apartmentId: invoice.apartmentId,
                    paymentMethod: invoice.paymentMethod,
                    dueDate: invoice.dueDate,
                    paymentDate: invoice.paymentDate,
                    message: resMessage.message,
                    value: invoice.value,
                    totalValue: invoice.totalValue,
                    startReferenceDate: invoice.startReferenceDate,
                    endReferenceDate: invoice.endReferenceDate,
                    tax: invoice.tax,
                    refund: invoice.refund,
                    expense: invoice.expense,
                    fine: invoice.fine,
                    discount: invoice.discount,
                    condominium: invoice.condominium,
                    fineTicket: invoice.fineTicket,
                    stepValue: invoice.stepValue,
                    commission: invoice.commission,
                },
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

        if (resPayAdapter?.err)
            return returnTopic(
                {
                    invoiceId: invoice.invoiceId,
                    paymentDate: null,
                    statusInvoice: invoice.statusInvoice,
                    paymentMethod: invoice.paymentMethod,
                    type: invoice.type,
                    message: resMessage.message,
                    referenceCode: 7,
                },
                true,
            );

        const paymentDate: Date =
            resPayAdapter?.payment?.receivedDate || new Date();
        const newStatusInvoice = EnumInvoiceStatus.paid;

        console.log(111, resPayAdapter.data.payment);
        const returnCode = resPayAdapter.data.payment.returnCode;

        const { code, message }: any = defaultReturnMessage(returnCode);

        let referenceCode = ['00', 0, '04', '4', 4].includes(returnCode)
            ? 1
            : 7;

        const updateInvoice: TInvoice = {
            ...invoice,
            paymentDate,
            statusInvoice: newStatusInvoice,
            returnMessage: message,
            paymentId: resPayAdapter?.data?.payment?.paymentId,
            tid: resPayAdapter.data.payment.tid,
            returnCode: code,
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
                    referenceCode,
                    message: message,
                },
                true,
            );

        return returnTopic(
            {
                invoiceId: invoice.invoiceId,
                paymentDate,
                statusInvoice: newStatusInvoice,
                paymentMethod: invoice.paymentMethod,
                type: invoice.type,
                message:
                    referenceCode == 1
                        ? 'successful payment'
                        : 'payment payment problems',
                returnMessage: resPayAdapter?.data?.payment?.returnMessage,
                paymentId: resPayAdapter?.data?.payment?.paymentId,
                tid: resPayAdapter.data.payment.tid,
                returnCode: resPayAdapter.data.payment.returnCode,
                referenceCode,
                receipt: {
                    err: referenceCode == 7,
                    referenceCode,
                    invoiceId: invoice.invoiceId,
                    statusInvoice: newStatusInvoice,
                    residentName: resident.name,
                    enterpriseId: invoice.enterpriseId,
                    apartmentId: invoice.apartmentId,
                    paymentMethod: invoice.paymentMethod,
                    paymentDate,
                    message: message,
                    tid: resPayAdapter.data.payment.tid,
                    dueDate: invoice.dueDate,
                    value: invoice.value,
                    totalValue: invoice.totalValue,
                    startReferenceDate: invoice.startReferenceDate,
                    endReferenceDate: invoice.endReferenceDate,
                    tax: invoice.tax,
                    refund: invoice.refund,
                    expense: invoice.expense,
                    fine: invoice.fine,
                    discount: invoice.discount,
                    condominium: invoice.condominium,
                    fineTicket: invoice.fineTicket,
                    stepValue: invoice.stepValue,
                    commission: invoice.commission,
                },
            },
            referenceCode == 7,
        );
    } catch (error: any) {
        return returnTopic(
            {
                invoiceId: invoice.invoiceId,
                paymentDate: null,
                statusInvoice: invoice.statusInvoice,
                paymentMethod: invoice.paymentMethod,
                type: invoice.type,
                message: 'Problemas com o Cartão de Crédito',
                referenceCode: 7,
            },
            true,
        );
    }
};
