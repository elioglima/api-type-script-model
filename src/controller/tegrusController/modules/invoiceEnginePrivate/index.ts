import {
    TInvoiceFilter,
    EnumTypeInvoice,
    TInvoice,
} from './../../../../domain/Tegrus/TInvoice';
import { EnumInvoiceStatus } from './../../../../domain/Tegrus/EnumInvoiceStatus';
import { Request, Response } from 'express';
import InvoiceService from '../../../../service/invoiceService/index';
import RecurrenceService from '../../../../service/recurrenceService';
import { invoiceToTResident } from '../../../../utils/parse';
import moment from 'moment';
import { TResident } from '../../../../domain/Tegrus';

const invoiceEnginePrivate = async (req: Request, res: Response) => {
    try {
        const invoiceService = new InvoiceService();
        const recurrenceService = new RecurrenceService();

        const todayDate: string = moment().format('YYYY-MM-DD 23:59:59');
        const backwardDate: string = moment(todayDate)
            .subtract(20, 'days')
            .format('YYYY-MM-DD 00:00:00');

        const invoiceSearch: TInvoiceFilter = {
            startDate: backwardDate,
            endDate: todayDate,
            active: true,
            type: EnumTypeInvoice.rent,
            statusInvoice: EnumInvoiceStatus.issued,
        };

        const invoicesFounded: any = await invoiceService.Find(invoiceSearch);

        if (invoicesFounded.err) return invoicesFounded;

        if (!invoicesFounded.data.length) return;

        const result: Array<Object> = await Promise.all(
            invoicesFounded.data
                .map(async (invoice: TInvoice) => {
                    const resident: TResident | any = invoiceToTResident(
                        invoice?.residentIdenty,
                    );
                    const recurrency: any =
                        await recurrenceService.FindOneResidentId(resident.id);   
                    
                    if(recurrency?.err) return

                    if (
                        recurrency?.data?.message
                            ?.toString()
                            .toLocaleLowerCase()
                            .trim() == 'recurrence not found'
                    )
                        return {
                            err: true,
                            data: recurrency.data.message,
                        };

                    if (recurrency.data.RecurrentTransactions == 3) {
                        await invoiceService.Update({
                            ...invoice,
                            statusInvoice: EnumInvoiceStatus.paymentError,
                        });
                        return {
                            statusInvoice: {
                                invoiceId: invoice.invoiceId,
                                recurrentPaymentId:
                                    recurrency.data.recurrentPaymentId,
                                statusInvoice: 'payment_error',
                                paymentMethod: 'credit',
                                paymentDate: new Date(),
                                recurenceL: {
                                    ...recurrency.data,
                                },
                            },
                        };
                    }

                    if (recurrency.data.RecurrentTransactions == 1) {
                        await invoiceService.Update({
                            ...invoice,
                            statusInvoice: EnumInvoiceStatus.paid,
                            paymentId:
                                recurrency?.data?.RecurrentTransactions
                                    ?.PaymentId,
                            paymentDate: new Date(),
                        });
                        return {
                            statusInvoice: {
                                invoiceId: invoice.invoiceId,
                                recurrentPaymentId:
                                    recurrency.data.recurrentPaymentId,
                                statusInvoice: 'payment_error',
                                paymentMethod: 'credit',
                                paymentDate: new Date(),
                                recurenceL: {
                                    ...recurrency.data,
                                },
                            },
                        };
                    }

                    return {
                        invoiceId: invoice.invoiceId,
                        recurrentPaymentId: recurrency.data.recurrentPaymentId,
                        paymentMethod: 'credit',
                        paymentDate: new Date(),
                        recurenceL: {
                            ...recurrency.data,
                        },
                    };
                })
                .filter((f: any) => !f?.err),
        );

      
        res.status(200).json({
            statusInvoice: {
                invoices: [...result],
            },
        });
    } catch (error) {
        console.log('ERROR', error);
    }
};

export { invoiceEnginePrivate };
