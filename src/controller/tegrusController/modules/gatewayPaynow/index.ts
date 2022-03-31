import { Request, Response } from 'express';
import HashSearchService from './hashSearchService';
import InvoiceService from '../../../../service/invoiceService';

import {
    TFirstPaymentExecReq,
    TInvoice,
    TResident,
} from '../../../../domain/Tegrus';

import { EnumTopicStatusInvoice } from '../../../../domain/Tegrus/TStatusInvoice';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';

import { payNowCredit } from './payNowCredit';
import { payNowRecurrence } from './payNowRecurrence';

const returnTopic = (
    response: {
        invoiceId?: number;
        paymentDate?: Date | any;
        statusInvoice?: EnumTopicStatusInvoice;
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
                    invoiceId: 125,
                    messageError: err
                        ? response?.message || 'unexpected error'
                        : undefined,
                },
            ],
        },
    };
};

const servicePrivate = async (payload: TFirstPaymentExecReq) => {
    try {
        const hashServices = new HashSearchService();
        const { hash } = payload;

        // conferir regra se o hash expirou se nao existe
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

        const invoice: TInvoice = resInvoice.data;
        const resident: TResident = invoice.resident;

        if (
            [
                EnumInvoiceType.booking,
                EnumInvoiceType.rent,
                EnumInvoiceType.spot,
            ].includes(invoice.type)
        ) {
            if (invoice.paymentMethod == EnumInvoicePaymentMethod.credit) {
                return await payNowRecurrence(payload, invoice, resident);
            }

            return await payNowCredit(payload, invoice, resident);
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
        const body: TFirstPaymentExecReq = req?.body;
        const response = await servicePrivate(body);
        return res.status(response.status).json(response);
    } catch (error: any) {
        console.log('ERROR', error);
        return res.status(422).json(error);
    }
};

export { gatewayPaynow };
