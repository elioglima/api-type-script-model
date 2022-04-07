import InvoiceService from '../../../../service/invoiceService';
import { EnumInvoiceStatus } from '../../../../domain/Tegrus/EnumInvoiceStatus';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
import { TPayNowReq } from '../../../../domain/Tegrus';
import { payAdatpter } from './payAdatpter';

const returnMessage = (value: number) => {
    switch (value) {
        case 1:
            return 'Autorizada';
        case 2:
            return 'Não Autorizada';
        case 3:
            return 'Cartão Expirado';
        case 4:
            return 'Cartão Bloqueado';
        case 5:
            return 'Time Out';
        case 6:
            return 'Cartão Cancelado';
        default:
            return 'Problemas com o Cartão de Crédito';
    }
};

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
                receipt: {
                    referenceCode: 1,
                    invoiceId: invoice.invoiceId,
                    statusInvoice: invoice.statusInvoice,
                    residentName: resident.name,
                    enterpriseId: invoice.enterpriseId,
                    apartmentId: invoice.apartmentId,
                    paymentId: invoice.paymentId,
                    paymentMethod: invoice.paymentMethod,
                    dueDate: invoice.dueDate,
                    paymentDate: invoice.paymentDate,
                    message: returnMessage(1),
                    value: invoice.value,
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
                    message: returnMessage(7),
                    referenceCode: 7,
                },
                true,
            );

        const paymentDate: Date =
            resPayAdapter?.payment?.receivedDate || new Date(); // so de exemplo
        const newStatusInvoice = EnumInvoiceStatus.paid; // so de exemplo

        const returnCode = resPayAdapter.data.payment.returnCode;

        /* 
            TO-DO-BETO
            1 = Autorizada
            2 = Não Autorizada
            3 = Cartão Expirado
            4 = Cartão Bloqueado
            5 = Time Out
            6 = Cartão Cancelado
            7 = Problemas com o Cartão de Crédito

        */
        let referenceCode = ['00', 0, 4].includes(returnCode) ? 1 : 7;

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
                    referenceCode,
                    message: returnMessage(referenceCode),
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
            receipt: {
                referenceCode: 1,
                invoiceId: invoice.invoiceId,
                statusInvoice: invoice.statusInvoice,
                residentName: resident.name,
                enterpriseId: invoice.enterpriseId,
                apartmentId: invoice.apartmentId,
                paymentId: invoice.paymentId,
                paymentMethod: invoice.paymentMethod,
                dueDate: invoice.dueDate,
                paymentDate: invoice.paymentDate,
                message: returnMessage(referenceCode),
                value: invoice.value,
            },
        });
    } catch (error: any) {
        return returnTopic(
            {
                invoiceId: invoice.invoiceId,
                paymentDate: null,
                statusInvoice: invoice.statusInvoice,
                paymentMethod: invoice.paymentMethod,
                type: invoice.type,
                message: returnMessage(7),
                referenceCode: 7,
            },
            true,
        );
    }
};
