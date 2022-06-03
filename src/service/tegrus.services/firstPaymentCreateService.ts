import { HashDataRepository } from './../../dataProvider/repository/HashDataRepository';
import { hashData } from './../../domain/Tegrus/TFirstPayment';
import { TErrorGeneric, PromiseExec } from '../../domain/Generics';
import { resFirstPaymentCreate } from '../../domain/Tegrus/TFirstPayment';
import { TInvoice, TRecurrenceSchedule, TResident } from '../../domain/Tegrus';
import {
    reqCreateHash,
    resCreateHash,
} from '../../domain/Tegrus/TFirstPayment';
import createHash from './createHash';
import moment from 'moment';
import { EnumInvoiceType } from '../../domain/Tegrus/EnumInvoiceType';

import RecurrenceService from '../../service/recurrenceService';
import ResidentService from '../../service/residentService';
import InvoiceService from '../../service/invoiceService';
import CardService from '../../service/CardService';
import ResponsiblePaymentService from '../../service/responsiblePaymentService';

export default async (payload: TInvoice) => {
    try {
        const recurrenceService = new RecurrenceService();
        const residentService = new ResidentService();
        const invoiceService = new InvoiceService();
        const responsiblePaymentService = new ResponsiblePaymentService();
        const HashRep = new HashDataRepository();
        const cardService = new CardService();
        const { responsiblePayment, resident, ...invoice } = payload;

        const checkedAndActiveRecurrence =
            invoice?.type == EnumInvoiceType.rent && invoice.isRecurrence;

        if (checkedAndActiveRecurrence) {
            const res: any = await recurrenceService.FindOneResidentId(
                resident.id,
            );

            if (res?.data?.desactived) {
                const residentFindOne: {
                    err?: any;
                    data?: TResident | any;
                } = await residentService.FindOne(resident.id);

                const invoice = payload;
                const resCardService = await cardService.findResidentId(
                    resident.enterpriseId,
                    resident.id,
                );

                const card = {
                    cardNumber: resCardService?.data?.cardNumber,
                    brand: resCardService?.data?.brand,
                    expirationDate: resCardService?.data?.expirationDate,
                    customerName: resCardService?.data?.holder,
                    holder: resCardService?.data?.holder,
                    securityCode: resCardService?.data?.securityCode,
                };

                const payloadRecurrence: TRecurrenceSchedule = {
                    startDateContract: residentFindOne?.data?.startDateContract,
                    endDateContract: residentFindOne?.data?.endDateContract,
                };

                const resRecurrence =
                    await recurrenceService.ScheduleRecurrence(
                        resident,
                        invoice,
                        payloadRecurrence,
                        card,
                    );

                if (resRecurrence?.err) {
                    return {
                        err: false,
                        abort: true,
                        data: {
                            invoiceId: invoice.invoiceId,
                            ...resRecurrence?.data?.data,
                            message:
                                'Reactivation of recurrence and initial payment made.',
                        },
                    };
                }
            }
        }

        try {
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

        const residentFindOne = await residentService.FindOne(resident.id);

        if (!residentFindOne?.data) {
            const resultPR: any = await residentService.add(resident);

            if (resultPR?.err) {
                return resultPR;
            }
        }

        const resultIN: any = await invoiceService.FindOneInclude({
            ...payload,
            residentIdenty: resident.id,
            resident,
        });

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
            lifeTime: moment(invoice.dueDate).add('days', 1).toDate(), //moment().add('days', 30).toDate(),
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
