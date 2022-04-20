import { Request, Response } from 'express';

import InvoiceService from '../../../../service/invoiceService';
import RecurrenceService from '../../../../service/recurrenceService';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoiceStatus } from '../../../../domain/Tegrus/EnumInvoiceStatus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
import { EnumBrands } from '../../../../enum';
import HashSearchService from './hashSearchService';
import { payNowCredit } from './payNowCredit';
import { payNowRecurrence } from './payNowRecurrence';
import { TPayNowReq } from '../../../../domain/Tegrus/TPayNow';
import { invoiceToTResident } from '../../../../utils';
import { FindCardByIdService } from '../../../../service/FindCardByIdService';

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
                        ? response?.message || 'unexpected error'
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
                Object.keys(resHash?.data || {}).find(f => f == 'isValid') &&
                !resHash?.data?.isValid
            )
                return resHash;

            resInvoice = await invoiceService.FindOne(
                resHash?.invoice?.invoiceId,
            );
        } else {
            resInvoice = await invoiceService.FindOne(payload.invoiceId);
        }

        if (resInvoice?.err)
            return returnTopic(
                { message: 'invoice not found in database' },
                true,
            );

        if (resInvoice?.data?.statusInvoice == 'paid') {
            return {
                err: false,
                data: {
                    message: 'invoice is already paid',
                },
            };
        }

        if (payload.cardId) {
            const findCardByIdService = new FindCardByIdService();
            const card = await findCardByIdService.execute(payload.cardId);

            if (card instanceof Error) {
                return returnTopic(
                    { message: 'card not found in database' },
                    true,
                );
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
            return returnTopic(
                { message: 'resident not found in database' },
                true,
            );

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
                    if (result?.err) return result;

                    // desativa hash caso o pagamento seja efetuado
                    await hashServices.TerminateHashTTL(hash);
                    return result;
                };

                if (invoice.isRecurrence && !invoice.atUpdate) {
                    const resPayNowRecurrence = await payNowRecurrence(
                        payload,
                        invoice,
                        resident,
                    );

                    return await checkedReturn(resPayNowRecurrence);
                }

                const resPayNowCredit: any = await payNowCredit(
                    payload,
                    invoice,
                    resident,
                );

                return await checkedReturn(resPayNowCredit);
            } else {
                return returnTopic(
                    { message: 'type not implemented for payment' },
                    true,
                );
            }
        } else {
            return returnTopic(
                { message: 'method not implemented for payment' },
                true,
            );
        }
    } catch (error: any) {
        console.log(error);
        return returnTopic(
            { message: 'resident not found in database, unexpected error' },
            true,
        );
    }
};

const gatewayPaynow = async (req: Request, res: Response) => {
    try {
        const body: TPayNowReq = req?.body;
        const response = await servicePrivate(body);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { gatewayPaynow };
