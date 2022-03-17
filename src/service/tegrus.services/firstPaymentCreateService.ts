import { HashDataRepository } from './../../dataProvider/repository/HashDataRepository';
import { hashData } from './../../domain/Tegrus/TFirstPayment';
import { TErrorGeneric, PromiseExec } from '../../domain/Generics';
import { resFirstPaymentCreate } from '../../domain/Tegrus/TFirstPayment';
import {
    TFirstPayment,
    // reqSendLinkResident 
} from '../../domain/Tegrus';
import {
    reqCreateHash,
    resCreateHash,
} from '../../domain/Tegrus/TFirstPayment';
import PreRegisterService from './PreRegisterService';
import { InvoiceRepository } from 'src/dataProvider/repository/InvoiceRepository';
// import sendLinkResident from './sendLinkResident';
import createHash from './createHash';
import moment from 'moment';

// import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export default async (
    payload: TFirstPayment,
): Promise<TErrorGeneric | resFirstPaymentCreate> => {
    const PreReg = new PreRegisterService();
    const InvRep = new InvoiceRepository();
    const HashRep = new HashDataRepository();

    const { resident, invoice } = payload;

    const resultPR: any = await PreReg.execute(resident);

    if (resultPR?.err) {
        return resultPR
    }

    const resultIN: any = await InvRep.persist(invoice);

    if (resultIN?.err) {
        return resultIN;
    }

    const dataHash: reqCreateHash = {
        invoiceId: 123,
        // url?: any
    };

    const resultHash: resCreateHash = await createHash(dataHash);

    if (resultHash?.err) {
        return {
            err: true,
            data: resultHash,
        };
    }

    const hashD: hashData = {
        hash: String(resultHash.hash),
        link: String(resultHash.link),
        invoiceId: invoice.invoiceId,
        nickname: resident.nickname,
        email: resident.email,
        smartphone: resident.smartphone,
        documentType: resident.documentType,
        document: resident.document,
        lifeTime: moment().add('days', 3).toDate(),
    };

    const resHashRep = await HashRep.persist(hashD);

    if (resHashRep?.err) {
        return resHashRep;
    }

    // const dataSendLinkResident: reqSendLinkResident = resultHash;
    // const resultSendLinkResident = sendLinkResident(dataSendLinkResident);

    const link_invoice: resFirstPaymentCreate = {
        invoice_id: invoice.invoiceId,
        link_credit: resultHash.link,
    };

    return PromiseExec(link_invoice);
};
