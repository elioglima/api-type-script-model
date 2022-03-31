import { HashDataRepository } from './../../dataProvider/repository/HashDataRepository';
import { hashData } from './../../domain/Tegrus/TFirstPayment';
import { TErrorGeneric, PromiseExec } from '../../domain/Generics';
import { resFirstPaymentCreate } from '../../domain/Tegrus/TFirstPayment';
import { TFirstPaymentReq } from '../../domain/Tegrus';
import { TInvoice } from '../../domain/Tegrus';
import {
    reqCreateHash,
    resCreateHash,
} from '../../domain/Tegrus/TFirstPayment';
import PreRegisterService from './PreRegisterService';
import { InvoiceRepository } from '../../dataProvider/repository/InvoiceRepository';
import createHash from './createHash';
import moment from 'moment';


export default async (
    payload: TFirstPaymentReq,
): Promise<TErrorGeneric | resFirstPaymentCreate> => {
    const PreReg = new PreRegisterService();
    const InvRep = new InvoiceRepository();
    const HashRep = new HashDataRepository();

    if (!payload?.createResident) {
        return {
            err: true,
            data: {
                message: 'Error createResident not informed',
            },
        };
    }

    const { createResident } = payload;
    const { resident, invoice } = createResident;

    const resultPR: any = await PreReg.execute(resident);

    if (resultPR?.err) {
        return resultPR;
    }

    const invoicePersist: TInvoice = {
        ...invoice,
        resident: resultPR.id,
    };

    const resultIN: any = await InvRep.persist(invoicePersist);
    
    if (resultIN instanceof Error)
        return { err: true, data: { message: 'Error to create invoice' } };

    const dataHash: reqCreateHash = {
        invoiceId: invoice.invoiceId,
        // url?: any
    };

    const resultHash: resCreateHash = await createHash(dataHash);

    if (resultHash?.err) {
        return {
            err: true,
            data: resultHash,
        };
    }

    if (!resultHash?.hash) {
        return {
            err: true,
            data: {
                message: 'Error hash not created',
            },
        };
    }

    const hashD: hashData = {
        hash: String(resultHash.hash),
        lifeTime: moment().add('days', 3).toDate(),
        invoiceId: Number(invoice.invoiceId),
    };

    const resHashRep = await HashRep.persist(hashD);

    if (resHashRep?.err) {
        return resHashRep;
    }

    // const dataSendLinkResident: dataSendLinkResident = {
    //     invoiceId: Number(resultHash.invoiceId),
    //     url: String(resultHash.link),
    //     email: String(resident.email),
    //     smartphone: resident.smartphone,
    // };

    // const resultSendLinkResident = await sendLinkResident(dataSendLinkResident);

    // if (resultSendLinkResident instanceof Error) {
    //     return resultSendLinkResident;
    // }

    const link_invoice: resFirstPaymentCreate = {
        invoiceId: invoice.invoiceId,
        hashCredit: resultHash?.hash,
    };

    return PromiseExec(link_invoice);
};
