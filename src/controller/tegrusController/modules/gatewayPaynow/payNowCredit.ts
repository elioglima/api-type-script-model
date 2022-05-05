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
                              messageError: message || 'unexpected error',
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
        if (['00', '1', '4'].includes(String(invoice?.returnCode))) {
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
        console.log(123);
        const resPayAdapter: any = await payAdatpter(
            resident,
            {
                ...payload.card,
                hash: payload.card?.securityCode,
            },
            invoice,
            true,
        );
        console.log(124);

        const paymentDate: Date =
            resPayAdapter?.payment?.receivedDate || new Date();
        const newStatusInvoice = EnumInvoiceStatus.paid;
        const returnCode = resPayAdapter?.data?.payment?.returnCode;

        const { code, message }: any = defaultReturnMessage(returnCode);
        console.log(code, message);
        console.log(999, 'resPayAdaptersss', resPayAdapter?.data?.data);
        console.log(77777, resident);

        if (resPayAdapter?.err || resPayAdapter?.data?.data)
            return returnTopic(
                {
                    invoiceId: invoice.invoiceId,
                    paymentDate: null,
                    statusInvoice: invoice.statusInvoice,
                    paymentMethod: invoice.paymentMethod,
                    type: invoice.type,
                    message: resMessage.message,
                    messagePrivate:
                        resPayAdapter?.data?.data?.message ||
                        resPayAdapter?.data?.message ||
                        'no messages returned from cielo',
                    referenceCode: code,
                    referenceDescription: message,
                },
                true,
            );

        let referenceCode = code;

        let resUpdate: any = {};

        if (referenceCode == 1) {
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

            resUpdate = await invoiceService.Update(updateInvoice);
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
        }

        return returnTopic(
            {
                invoiceId: invoice.invoiceId,
                paymentDate,
                statusInvoice:
                    referenceCode != 1
                        ? invoice.statusInvoice
                        : newStatusInvoice,
                paymentMethod: invoice.paymentMethod,
                type: invoice.type,
                message:
                    referenceCode == 1
                        ? 'successful payment'
                        : 'payment payment problems',
                returnMessage: resPayAdapter?.data?.payment?.returnMessage,
                paymentId:
                    referenceCode != 1
                        ? null
                        : resPayAdapter?.data?.payment?.paymentId,
                tid: referenceCode != 1 ? null : resPayAdapter.data.payment.tid,
                returnCode: resPayAdapter.data.payment.returnCode,
                referenceCode,
                receipt: {
                    err: referenceCode != 1,
                    referenceCode,
                    invoiceId: invoice.invoiceId,
                    statusInvoice:
                        referenceCode != 1
                            ? invoice.statusInvoice
                            : newStatusInvoice,
                    residentName: resident.name,
                    residentEmail: resident.email,
                    residentDocumentType: resident.documentType,
                    residentDocument: resident.document,
                    enterpriseId: invoice.enterpriseId,
                    apartmentId: invoice.apartmentId,
                    paymentMethod: invoice.paymentMethod,
                    paymentDate,
                    message: message,
                    tid:
                        referenceCode != 1
                            ? null
                            : resPayAdapter.data.payment.tid,
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
            referenceCode != 1,
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
