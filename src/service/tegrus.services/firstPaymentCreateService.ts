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
import ResponsiblePaymentService from '../../service/responsiblePaymentService';

export default async (
    payload: TInvoice,
): Promise<TErrorGeneric | resFirstPaymentCreate> => {
    try {
        const residentService = new ResidentService();
        const invoiceService = new InvoiceService();
        const responsiblePaymentService = new ResponsiblePaymentService();

        const HashRep = new HashDataRepository();

        const { responsiblePayment, resident, ...invoice } = payload;

        try {
            console.log(456789, responsiblePayment);
            if (Array.isArray(responsiblePayment)) {
                responsiblePayment.forEach(async responsiblePayment => {
                    await responsiblePaymentService.IncludeOrUpdate({
                        apartmentId: resident.apartmentId,
                        enterpriseId: resident.enterpriseId,
                        ...responsiblePayment,
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }

        const resultPR: any = await residentService.add(resident);

        if (resultPR?.err) {
            return resultPR;
        }

        const resultIN: any = await invoiceService.FindOneInclude({
            ...payload,
            residentIdenty: payload.resident.id,
            resident,
        });

        console.log(11122, resultIN);
        if (resultIN?.err) return resultIN;

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
            lifeTime: moment(invoice.dueDate).toDate(), //moment().add('days', 30).toDate(),
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
    } catch (error) {
        console.log(888, error);
        return {
            err: true,
            data: {
                message: 'Error hash not created',
            },
        };
    }
};
