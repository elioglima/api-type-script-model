import { HashDataRepository } from './../../dataProvider/repository/HashDataRepository';
import { hashData } from './../../domain/Tegrus/TFirstPayment';
import { TErrorGeneric, PromiseExec } from '../../domain/Generics';
import { resFirstPaymentCreate } from '../../domain/Tegrus/TFirstPayment';
import { TInvoice } from '../../domain/Tegrus';
import {
    reqCreateHash,
    resCreateHash,
} from '../../domain/Tegrus/TFirstPayment';
import createHash from './createHash';
import moment from 'moment';
import ResidentService from '../../service/residentService';
import InvoiceService from '../../service/invoiceService';

export default async (
    payload: TInvoice,
): Promise<TErrorGeneric | resFirstPaymentCreate> => {
    const residentService = new ResidentService();
    const invoiceService = new InvoiceService();
    const HashRep = new HashDataRepository();

    const { resident, ...invoice } = payload;

    const resultPR: any = await residentService.add(resident);

    if (resultPR?.err) {
        return resultPR;
    }

    const resultIN: any = await invoiceService.FindOneInclude({
        ...payload,
        residentIdenty: payload.resident.id,
    });
    if (resultIN?.err) {
        return resultPR;
    }

    const dataHash: reqCreateHash = {
        invoiceId: invoice.invoiceId,
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

    if (!resultHash?.hash || !resultHash?.hash.toString().length) {
        return {
            err: true,
            data: {
                message: 'Error hash not created',
            },
        };
    }

    const link_invoice: resFirstPaymentCreate = {
        invoiceId: invoice.invoiceId,
        hashCredit: resultHash?.hash,
    };

    return PromiseExec(link_invoice);
};
