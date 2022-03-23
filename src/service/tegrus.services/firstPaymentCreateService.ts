import { HashDataRepository } from './../../dataProvider/repository/HashDataRepository';
import { hashData } from './../../domain/Tegrus/TFirstPayment';
import { TErrorGeneric, PromiseExec } from '../../domain/Generics';
import { resFirstPaymentCreate } from '../../domain/Tegrus/TFirstPayment';
import { TFirstPayment } from '../../domain/Tegrus';
import {
    reqCreateHash,
    resCreateHash,
    dataSendLinkResident,
} from '../../domain/Tegrus/TFirstPayment';
import PreRegisterService from './PreRegisterService';
import { InvoiceRepository } from '../../dataProvider/repository/InvoiceRepository';
import sendLinkResident from './sendLinkResident';
import createHash from './createHash';
import moment from 'moment';

type TFirstPaymentReq = {
    createResident: TFirstPayment;
};
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
                message: 'Error not createResident',
            },
        };
    }

    const { createResident } = payload;
    const { resident, invoice } = createResident;
    console.log({ resident, invoice });
    const resultPR: any = await PreReg.execute(resident);

    if (resultPR?.err) {
        return resultPR;
    }

    const resultIN: any = await InvRep.persist(invoice);

    if (resultIN?.err) {
        return resultIN;
    }

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
        link: String(resultHash.link),
        InvoiceEntity: resultIN,
        PreRegisterResidentEntity: resultPR,
        lifeTime: moment().add('days', 3).toDate(),
    };

    const resHashRep = await HashRep.persist(hashD);
    const resFindHash = await HashRep.getByHash(resultHash.hash);
    console.log({ hashD, resHashRep, resFindHash });

    if (resHashRep?.err) {
        return resHashRep;
    }

    const dataSendLinkResident: dataSendLinkResident = {
        invoiceId: Number(resultHash.invoiceId),
        url: String(resultHash.link),
        email: String(resident.email),
        smartphone: resident.smartphone,
    };

    const resultSendLinkResident = await sendLinkResident(dataSendLinkResident);

    if (resultSendLinkResident instanceof Error) {
        return resultSendLinkResident;
    }

    const link_invoice: resFirstPaymentCreate = {
        invoice_id: invoice.invoiceId,
        hash_credit: resultHash?.hash,
    };

    return PromiseExec(link_invoice);
};
