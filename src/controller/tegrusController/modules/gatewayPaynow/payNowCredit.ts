
import InvoiceService from '../../../../service/invoiceService';
import { EnumInvoiceStatus } from '../../../../domain/Tegrus/EnumInvoiceStatus';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
import { TPayNowReq } from '../../../../domain/Tegrus';
import { payAdatpter } from './payAdatpter';
import AdapterPayment from '../../../../domain/AdapterPayment';

const returnTopic = (
    response: {
        invoiceId: number;
        paymentDate: Date | any;
        statusInvoice: EnumInvoiceStatus;
        paymentMethod: EnumInvoicePaymentMethod;
        type: EnumInvoiceType;
        message: string;
        [x:string]: any;
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

export const payNowCredit = async (
    payload: TPayNowReq,
    invoice: TInvoice,
    resident: TResident,
) => {
    try {
        const invoiceService = new InvoiceService()                

        const resPayAdapter: any = await payAdatpter(resident, {
            ...payload.card,
            hash: payload.card?.securityCode,
        }, invoice, true);


        console.log("resPayAdapter", resPayAdapter)
        
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

  
        const paymentDate: Date = resPayAdapter?.payment?.receivedDate || new Date(); // so de exemplo
        const newStatusInvoice = EnumInvoiceStatus.paid; // so de exemplo
       
        const updateInvoice: TInvoice = {
            ...invoice, 
            paymentDate, 
            statusInvoice: newStatusInvoice,
            returnMessage: resPayAdapter.data.payment.returnMessage,
            paymentId: resPayAdapter.data.payment.paymentId,
            tid: resPayAdapter.data.payment.tid,
            returnCode: resPayAdapter.data.payment.returnCode            
        }               

        const resUpdate:any = await invoiceService.Update(updateInvoice)
                                 

        return returnTopic({
            invoiceId: invoice.invoiceId,
            paymentDate,
            statusInvoice: newStatusInvoice,
            paymentMethod: invoice.paymentMethod,
            type: invoice.type,
            message: 'recurrence started successfully',            
            returnMessage: resPayAdapter?.data?.payment?.returnMessage,
            paymentId: resPayAdapter.data.payment.paymentId,
            tid: resPayAdapter.data.payment.tid,
            returnCode: resPayAdapter.data.payment.returnCode   
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
