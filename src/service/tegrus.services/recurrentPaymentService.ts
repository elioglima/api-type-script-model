import HashSearchService from './hashSearchService';
import Adapter from '../../domain/Adapter';
import { reqRecurrentCreate } from '../../domain/RecurrentPayment';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';
import { PaymentRecurrenceRepository } from '../../dataProvider/repository/PaymentRecurrenceRepository';
import { InvoiceRepository } from 'src/dataProvider/repository/InvoiceRepository';
import {
    TStatusRecurrency,
    EnumPayMethod,
    TStatusInvoice,
    TFirstPaymentExecReq,
    TInvoice,
} from '../../domain/Tegrus';
import moment from 'moment';

export default async (payload: TFirstPaymentExecReq) => {
    try {
        const hashServices = new HashSearchService();
        const paymentAdapter = new Adapter();
        const paymentRecurrenceRepository = new PaymentRecurrenceRepository();
        const invRep = new InvoiceRepository();
        const { hash } = payload;
        const resHash: any = await hashServices.execute(hash);

        if (resHash.err) return resHash;

        if (resHash?.invoice?.recurrenceId)
            return { err: true, data: 'Already exists a scheduled recurrence' };

        const { enterpriseId } = resHash?.resident;

        await paymentAdapter.init(parseInt(enterpriseId));

        const makeRecurrent: reqRecurrentCreate = {
            merchantOrderId: resHash?.invoice?.invoiceId
                .toString()
                .concat(
                    moment()
                        .format('YYYYMMDDHH:mm')
                        .concat(payload?.card?.cardNumber.slice(-4)),
                ),
            customer: {
                name: resHash?.resident?.name,
            },
            payment: {
                type: 'CreditCard',
                amount: resHash?.invoice?.value,
                installments: 1,
                softDescriptor: 'Recorrencia JFL',
                recurrentPayment: {
                    authorizeNow: false,
                    endDate: resHash?.invoice?.endReferenceDate,
                    interval: 'Monthly',
                },
                creditCard: {
                    cardNumber: payload?.card?.cardNumber,
                    holder: payload?.card?.holder,
                    expirationDate: payload?.card?.expirationDate,
                    customerName: payload?.card?.customerName,
                    brand: payload?.card?.brand                    
                },
            },
        };

        const resRecurrentCreate: any = await paymentAdapter.recurrentCreate(
            makeRecurrent,
        );

        if (resRecurrentCreate?.err) return resRecurrentCreate;

        const persisRecurrency: PaymentRecurrence = {
            createdAt: new Date(),
            paymentCard: resRecurrentCreate?.payment?.creditCard,
            recurrenceId:
                resRecurrentCreate?.payment?.recurrentPayment
                    ?.recurrentPaymentId,
            value: resRecurrentCreate?.payment?.amount,
            preUserId: resHash?.resident?.id,
            residentId: resHash?.invoice?.residentId,
        };

        const resPaymentRecurrencyPersist =
            await paymentRecurrenceRepository.persist(persisRecurrency);
        if (resPaymentRecurrencyPersist instanceof Error) {
            return resPaymentRecurrencyPersist;
        }

        const resInv: TInvoice = await invRep.update({
            ...resHash?.invoice,
            recurrenceId: resPaymentRecurrencyPersist.id,
        });

        if (resInv instanceof Error) return { err: true, data: resInv };

        const resRecurrency: TStatusRecurrency = {
            invoiceId: Number(resHash?.invoice?.invoiceId),
            description: resRecurrentCreate?.payment?.softDescriptor,
            paidAt: new Date(
                resRecurrentCreate?.payment?.recurrentPayment?.nextRecurrency,
            ),
            paymentMethod: EnumPayMethod.CREDIT,
            statusInvoice: TStatusInvoice.PUBLICADO,
        };

        return resRecurrency;
    } catch (error) {
        console.log('ERR', error);
    }
};
