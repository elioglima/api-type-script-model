import { Response } from 'express';
import { cieloStatusConverter } from '../../../../utils/cieloStatus';
import {
    TInvoiceFilter,
    EnumTypeInvoice,
    TInvoice,
} from './../../../../domain/Tegrus/TInvoice';
import { EnumInvoiceStatus } from './../../../../domain/Tegrus/EnumInvoiceStatus';
import InvoiceService from '../../../../service/invoiceService/index';
import RecurrenceService from '../../../../service/recurrenceService';
import { invoiceToTResident } from '../../../../utils/parse';
import moment from 'moment';
import { TResident } from '../../../../domain/Tegrus';

const invoiceEnginePrivate = async (res: Response) => {
    try {
        console.log('invoiceEnginePrivate');
        return res.status(200).json({
            statusInvoice: {
                invoices: [
                    {
                        invoiceId: 390,
                        statusInvoice: 'payment_error',
                        paymentMethod: 'credit',
                        tryNumber: 4,
                        messageError: 'Cartão com limite insuficiente',
                    },
                    {
                        invoiceId: 387,
                        statusInvoice: 'payment_error',
                        paymentMethod: 'credit',
                        tryNumber: 2,
                        messageError: 'Problemas com Cartão',
                    },
                    {
                        invoiceId: 420,
                        recurrentPaymentId:
                            'd2ca3af5-506e-488a-bb81-7d58e0b3210e',
                        statusInvoice: 'paid',
                        paymentMethod: 'credit',
                        paymentDate: new Date(),
                    },
                ],
            },
        });

        const invoiceService = new InvoiceService();
        const recurrenceService = new RecurrenceService();

        const todayDate: string = moment()
            .add(10, 'days')
            .format('YYYY-MM-DD 23:59:59');
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

        console.log('invoiceEnginePrivate.invoiceSearch');

        const invoicesFounded: any = await invoiceService.Find(invoiceSearch);
        if (invoicesFounded.err) return invoicesFounded;
        console.log('invoiceEnginePrivate.invoicesFounded');

        if (!invoicesFounded.data.length)
            return res.status(200).json({
                statusInvoice: {
                    invoices: [],
                },
            });

        console.log('invoiceEnginePrivate.result');

        const result: Array<Object> = await Promise.all(
            invoicesFounded.data
                .map(async (invoice: TInvoice) => {
                    console.log('invoiceEnginePrivate.invoice', invoice);

                    try {
                        const resident: TResident | any = invoiceToTResident(
                            invoice?.residentIdenty,
                        );

                        const recurrency: any =
                            await recurrenceService.FindOneResidentId(
                                resident.id,
                            );

                        console.log(
                            'invoiceEnginePrivate.recurrency',
                            recurrency,
                        );

                        if (recurrency?.err) return;

                        if (
                            recurrency?.data?.message
                                ?.toString()
                                .toLocaleLowerCase()
                                .trim() == 'recurrence not found'
                        ) {
                            await invoiceService.Update({
                                ...invoice,
                                statusInvoice: EnumInvoiceStatus.paymentError,
                                returnMessage: recurrency?.data?.message,
                            });

                            return {
                                invoiceId: invoice.invoiceId,
                                statusInvoice: 'payment_error',
                                paymentMethod: 'credit',
                                paymentDate: new Date(),
                                message: recurrency?.data?.message,
                            };
                        }

                        const recurrenceNumber: number =
                            Number(invoice?.recurenceNumber) - 1;
                        const paymentId: string =
                            recurrency?.data?.recurrentTransactions[
                                recurrenceNumber
                            ]?.paymentId;
                        const tryNumber: number =
                            recurrency?.data?.recurrentTransactions[
                                recurrenceNumber
                            ]?.tryNumber;
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
                                recurrency?.data?.recurrentPaymentId,
                            statusInvoice: cieloStatusConverter(
                                Number(recurrency?.data?.status),
                            ),
                            paymentMethod: invoice.paymentMethod,
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

        return res.status(200).json({
            statusInvoice: {
                invoices: [...result.filter((f: any) => !f?.err)],
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
