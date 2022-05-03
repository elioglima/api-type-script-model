import { cieloStatusConverter } from '../../../../utils/cieloStatus';
import {
    TInvoiceFilter,
    EnumTypeInvoice,
    TInvoice,
} from './../../../../domain/Tegrus/TInvoice';
import { EnumInvoiceStatus } from './../../../../domain/Tegrus/EnumInvoiceStatus';
import { Response } from 'express';
import InvoiceService from '../../../../service/invoiceService/index';
import RecurrenceService from '../../../../service/recurrenceService';
import { invoiceToTResident } from '../../../../utils/parse';
import moment from 'moment';
import { TResident } from '../../../../domain/Tegrus';

const invoiceEnginePrivate = async (res: Response) => {
    try {
        const invoiceService = new InvoiceService();
        const recurrenceService = new RecurrenceService();

        const todayDate: string = moment().format('YYYY-MM-DD 23:59:59');
        const backwardDate: string = moment(todayDate)
            .subtract(30, 'days')
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
                    try {
                        const resident: TResident | any = invoiceToTResident(
                            invoice?.residentIdenty,
                        );
                        const recurrency: any =
                            await recurrenceService.FindOneResidentId(
                                resident.id,
                            );

                        if (recurrency?.err) return;

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

                        const recurrenceNumber: number = Number(invoice?.recurenceNumber) - 1;
                        const paymentId: string =
                            recurrency?.data?.recurrentTransactions[recurrenceNumber]
                                ?.paymentId;
                        const tryNumber: number =
                            recurrency?.data?.recurrentTransactions[recurrenceNumber]
                                ?.tryNumber;
                        const enterpriseId: number = resident.enterpriseId;
                        const receiptCielo: any =
                            await invoiceService.GetInvoiceCielo(
                                paymentId,
                                enterpriseId,
                            );

                        if (
                            tryNumber >= 3 &&
                            ![1, 2].includes(
                                Number(receiptCielo?.payment.status),
                            )
                        ) {
                            await recurrenceService.DisableRecurrence(resident);
                            await invoiceService.Update({
                                ...invoice,
                                statusInvoice: EnumInvoiceStatus.paymentError,
                                tryNumber,
                            });
                            return {
                                statusInvoice: {
                                    invoiceId: invoice.invoiceId,
                                    recurrentPaymentId:
                                        recurrency.data.recurrentPaymentId,
                                    statusInvoice: cieloStatusConverter(10),
                                    paymentMethod: 'credit',
                                    paymentDate: new Date(),
                                    recurence: {
                                        ...recurrency.data,
                                    },
                                    message: 'recurrence off',
                                },
                            };
                        }

                        if (
                            [1, 2].includes(
                                Number(receiptCielo?.payment?.status),
                            )
                        ) {
                            await invoiceService.Update({
                                ...invoice,
                                statusInvoice: EnumInvoiceStatus.paid,
                                paymentId:
                                    recurrency?.data?.RecurrentTransactions
                                        ?.PaymentId,
                                paymentDate: new Date(),
                                tryNumber,
                            });
                            return {
                                err: false,
                                invoiceId: invoice.invoiceId,
                                recurrentPaymentId:
                                    recurrency.data.recurrentPaymentId,
                                statusInvoice: cieloStatusConverter(
                                    Number(recurrency?.data?.status),
                                ),
                                paymentMethod: 'credit',
                                paymentDate: new Date(),
                                recurence: {
                                    ...recurrency.data,
                                },
                            };
                        }

                        await invoiceService.Update({
                            ...invoice,
                            statusInvoice: EnumInvoiceStatus.paid,
                            paymentId:
                                recurrency?.data?.RecurrentTransactions
                                    ?.PaymentId,
                            paymentDate: new Date(),
                            tryNumber,
                        });

                        return {
                            err: true,
                            invoiceId: invoice.invoiceId,
                            recurrentPaymentId:
                                recurrency.data.recurrentPaymentId,
                            statusInvoice: cieloStatusConverter(
                                Number(recurrency?.data?.status),
                            ),
                            paymentMethod: 'credit',
                            paymentDate: new Date(),
                            recurence: {
                                ...recurrency.data,
                            },
                        };
                    } catch (error: any) {
                        return {
                            err: true,
                            data: error,
                        };
                    }
                })
                .filter((f: any) => !f?.err),
        );

        res.status(200).json({
            statusInvoice: {
                invoices: [...result],
            },
        });
    } catch (error: any) {
        console.log('ERROR', error);
        return res.status(500).json({
            err: true,
            data: error,
        });
    }
};

export { invoiceEnginePrivate };
