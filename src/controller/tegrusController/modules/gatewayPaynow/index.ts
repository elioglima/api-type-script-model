import { Request, Response } from 'express';
import moment from 'moment';

import InvoiceService from '../../../../service/invoiceService';
import RecurrenceService from '../../../../service/recurrenceService';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoiceStatus } from '../../../../domain/Tegrus/EnumInvoiceStatus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
import { EnumBrands } from '../../../../enum';
import HashSearchService from '../hashSearchService';
import { payNowCredit } from './payNowCredit';
import { payNowRecurrence } from './payNowRecurrence';
import { TPayNowReq } from '../../../../domain/Tegrus/TPayNow';
import { invoiceToTResident } from '../../../../utils';
import { FindCardByIdService } from '../../../../service/FindCardByIdService';
import ResponsiblePaymentService from '../../../../service/responsiblePaymentService';
import { EnMessages } from '../../../../enum';

const returnTopic = (
    response: {
        invoiceId?: number;
        paymentDate?: Date | any;
        statusInvoice?: EnumInvoiceStatus;
        paymentMethod?: EnumInvoicePaymentMethod;
        type?: EnumInvoiceType;
        message: string;
    },
    err: boolean = false,
) => {
    return {
        err,
        status: err ? 422 : 200,
        statusInvoice: {
            invoices: [
                {
                    messageError: err
                        ? response?.message || EnMessages.Error.UnexpectedError
                        : undefined,
                    ...response,
                },
            ],
        },
    };
};

const servicePrivate = async (payload: TPayNowReq) => {
    try {
        let resInvoice: {
            err?: boolean;
            data: TInvoice;
        };

        const invoiceService = new InvoiceService();
        const hashServices = new HashSearchService();
        const { hash } = payload;

        if (payload?.hash) {
            const resHash: any = await hashServices.execute(hash);
            if (resHash.err) return resHash;

            if (
                (Object.keys(resHash?.data || {}).find(f => f == 'isValid') &&
                    !resHash?.data?.isValid) ||
                [2].includes(resHash?.data?.code)
            )
                return {
                    err: true,
                    status: 422,
                    data: resHash?.data,
                };

            resInvoice = await invoiceService.FindOne(
                resHash?.invoice?.invoiceId,
            );
        } else {
            resInvoice = await invoiceService.FindOne(payload.invoiceId);
        }

        if (resInvoice?.err)
            return returnTopic(EnMessages.Error.InvoiceNotFound, true);

        if (resInvoice?.data?.statusInvoice == EnumInvoiceStatus.paid) {
            return {
                err: true,
                status: 422,
                data: EnMessages.Error.InvoiceIsPaid,
            };
        }

        if (resInvoice?.data?.statusInvoice == EnumInvoiceStatus.expired) {
            return {
                err: true,
                status: 422,
                data: EnMessages.Error.InvoiceIsExpired,
            };
        }

        if (resInvoice?.data?.statusInvoice != EnumInvoiceStatus.issued) {
            return {
                err: true,
                status: 422,
                data: EnMessages.Error.InvoiceCannotBePaid,
            };
        }

        // verifica vencimento expirado
        const timeNow: Date = moment().toDate();
        if (
            moment(resInvoice?.data?.dueDate).add('days', 1).isBefore(timeNow)
        ) {
            await invoiceService.Update({
                ...resInvoice?.data,
                isExpired: true,
                statusInvoice: EnumInvoiceStatus.expired,
            });

            return {
                err: true,
                status: 422,
                data: EnMessages.Error.InvoiceStatusChangeExpired,
            };
        }

        const responsiblePaymentService = new ResponsiblePaymentService();
        const responsiblePayment: any =
            await responsiblePaymentService.FindOneAE(
                resInvoice?.data?.apartmentId,
                resInvoice?.data?.enterpriseId,
            );

        if (payload.cardId) {
            const findCardByIdService = new FindCardByIdService();
            const card = await findCardByIdService.execute(payload.cardId);

            if (card instanceof Error) {
                return returnTopic(EnMessages.Error.CardNotFound, true);
            }

            payload.card = {
                cardNumber: String(card.hashC),
                customerName: String(card.holder),
                holder: String(card.holder),
                expirationDate: String(card.expirationDate),
                brand: card.brand as EnumBrands,
                securityCode: Number(card.hash),
            };
        }

        const { residentIdenty, ...invoiceData }: any = {
            residentIdenty: undefined,
            ...resInvoice.data,
        };

        const resident: TResident | any = invoiceToTResident(residentIdenty);
        const invoice: TInvoice = invoiceData;

        if (!resident)
            return returnTopic(EnMessages.Error.ResidentNotFound, true);

        if (
            [
                EnumInvoiceType.booking,
                EnumInvoiceType.rent,
                EnumInvoiceType.spot,
            ].includes(invoice.type)
        ) {
            if (invoice.paymentMethod == EnumInvoicePaymentMethod.credit) {
                const recurrenceService = new RecurrenceService();

                // desativa a recorrencia caso ela exista
                await recurrenceService.DisableIsExist(resident);

                const checkedReturn = async (result: any) => {
                    if (result?.err)
                        return {
                            ...result,

                            status: 422,
                        };

                    // desativa hash caso o pagamento seja efetuado
                    await hashServices.TerminateHashTTL(hash);
                    return {
                        ...result,
                        status: 200,
                    };
                };

                if (invoice.isRecurrence && !invoice.atUpdate) {
                    const resPayNowRecurrence = await payNowRecurrence(
                        payload,
                        invoice,
                        resident,
                        responsiblePayment?.data,
                    );

                    return await checkedReturn(resPayNowRecurrence);
                }

                const resPayNowCredit: any = await payNowCredit(
                    payload,
                    invoice,
                    resident,
                    responsiblePayment?.data,
                );

                return await checkedReturn(resPayNowCredit);
            } else {
                return returnTopic(
                    EnMessages.Error.InvoiceTypeNotImplemented,
                    true,
                );
            }
        } else {
            return returnTopic(
                EnMessages.Error.InvoiceTypeNotImplemented,
                true,
            );
        }
    } catch (error: any) {
        console.log(777, error);
        return returnTopic(EnMessages.Error.ResidentNotFound, true);
    }
};

const gatewayPaynow = async (req: Request, res: Response) => {
    try {
        const body: TPayNowReq = req?.body;
        const response = await servicePrivate(body);
        return res
            .status(response?.status || response?.err == true ? 422 : 500)
            .json(response);
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { gatewayPaynow };
