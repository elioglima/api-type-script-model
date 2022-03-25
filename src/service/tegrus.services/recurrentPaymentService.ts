import HashSearchService from './hashSearchService';
import { TFirstPaymentExecReq } from '../../domain/Tegrus';
import Adapter from '../../domain/Adapter';
import { reqRecurrentCreate } from '../../domain/RecurrentPayment';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';
import { PaymentRecurrenceRepository } from '../../dataProvider/repository/PaymentRecurrenceRepository';

export default async (payload: TFirstPaymentExecReq) => {
    try {
        const hashServices = new HashSearchService();
        const paymentAdapter = new Adapter();
        const paymentRecurrenceRepository = new PaymentRecurrenceRepository();
        const { hash } = payload;
        const resHash: any = await hashServices.execute(hash);
        const { enterpriseId } = resHash?.resident;

        await paymentAdapter.init(parseInt(enterpriseId));
        if (resHash?.err) return resHash;

        const makeRecurrent: reqRecurrentCreate = {
            merchantOrderId: '20141231231',
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
                    brand: payload?.card?.brand,
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
            id: 0,
            userId: 0,
        };

        const resPaymentRecurrencyPersist =
            await paymentRecurrenceRepository.persist(persisRecurrency);

        if (resPaymentRecurrencyPersist instanceof Error) {
            return resPaymentRecurrencyPersist;
        }

        return resRecurrentCreate;
    } catch (error) {
        console.log('ERR', error);
    }
};
