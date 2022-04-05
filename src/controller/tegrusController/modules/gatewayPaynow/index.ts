import { Request, Response } from 'express';

import InvoiceService from '../../../../service/invoiceService';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoiceStatus } from '../../../../domain/Tegrus/EnumInvoiceStatus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';

import HashSearchService from './hashSearchService';
import { payNowCredit } from './payNowCredit';
import { payNowRecurrence } from './payNowRecurrence';
import { TPayNowReq } from '../../../../domain/Tegrus/TPayNow';
import { invoiceToTResident } from '../../../../utils';

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
        const hashServices = new HashSearchService();
        const { hash } = payload;

        const resHash: any = await hashServices.execute(hash);
        if (resHash.err) return resHash;

        // if (resHash?.invoice?.recurrenceId)
        //     return { err: true, data: 'Already exists a scheduled recurrence' };

        // const { enterpriseId } = resHash?.resident;

        const invoiceService = new InvoiceService();
        const resInvoice: {
            err?: boolean;
            data: TInvoice;
        } = await invoiceService.FindOne(resHash?.invoice?.invoiceId);

        if (resInvoice?.err)
            return returnTopic(
                { message: 'invoice not found in database' },
                true,
            );

        console.log({ resInvoice });
        const { residentIdenty, ...invoice }: any = resInvoice.data;
        const resident: TResident | any = invoiceToTResident(residentIdenty);

        if (!resident)
            return returnTopic(
                { message: 'resdent not found in database' },
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
                if (invoice.isRecurrence && !invoice.atUpdate)
                    return await payNowRecurrence(payload, invoice, resident);

                const resPayNowCredit: any = await payNowCredit(
                    payload,
                    invoice,
                    resident,
                );
                return resPayNowCredit;
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
