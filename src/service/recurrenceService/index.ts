import debug from 'debug';
import {
    TRecurrence,
    TRecurrenceCard,
    TResident,
    TInvoice,
    TRecurrenceSchedule,
    TRecurrencePayment,
    TRecurrencyStatus,
} from '../../domain/Tegrus';
import { reqRecurrentDeactivate } from '../../domain/RecurrentPayment';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';
import { rError, rSuccess } from '../../utils';
import { reqRecurrentCreate } from '../../domain/RecurrentPayment';
import { PaymentRecurrenceRepository } from '../../dataProvider/repository/PaymentRecurrenceRepository';
import AdapterPayment from '../../domain/AdapterPayment';
import InvoiceService from '../invoiceService';
import { EnumInvoicePaymentMethod } from '../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceStatus } from '../../domain/Tegrus/EnumInvoiceStatus';
import moment from 'moment';

export default class RecurrenceService {
    private logger = debug('payment-api:RecurrenceService');
    private repository = new PaymentRecurrenceRepository();
    private invoiceService = new InvoiceService();
    private paymentAdapter = new AdapterPayment();

    public FindOneResidentId = async (residenteId: number) => {
        try {
            this.logger(`Find One FindOneResidentId`);

            const response: TRecurrence = await this.repository.getByResidentId(
                residenteId,
            );

            if (response?.err)
                return rError({
                    message: 'No resident found',
                });
            return rSuccess(response?.data);
        } catch (error: any) {
            return rError({
                message: error?.message,
            });
        }
    };

    public ScheduleRecurrence = async (
        resident: TResident,
        invoice: TInvoice,
        recurrence: TRecurrenceSchedule,
        card: TRecurrenceCard,
    ) => {
        try {
            this.logger(`Find One ScheduleRecurrence`);

            const checkExists: TRecurrence = await this.FindOneResidentId(
                resident.id,
            );

            if (checkExists?.err)
                return rError({
                    message:
                        'error when querying the recurrence in the database',
                });

            if (checkExists?.data?.row)
                return rError({
                    message: 'recurrence found in the database',
                });

            const resCreateAdapter = await this.paymentAdapter.init(
                resident.enterpriseId,
            );
            if (checkExists?.err) return rError(resCreateAdapter.data);

            const makeRecurrent: reqRecurrentCreate = {
                merchantOrderId: invoice?.invoiceId
                    .toString()
                    .concat(
                        moment()
                            .format('YYYYMMDDHH:mm')
                            .concat(card?.cardNumber.slice(-4)),
                    ),
                customer: {
                    name: resident?.name,
                },
                payment: {
                    type: 'CreditCard',
                    amount: invoice?.value,
                    installments: 1,
                    softDescriptor: 'Recorrencia JFL',
                    recurrentPayment: {
                        authorizeNow: true,
                        endDate: recurrence.endDateContract,
                        interval: 'Monthly',
                    },
                    creditCard: {
                        cardNumber: card?.cardNumber,
                        holder: card?.holder,
                        expirationDate: card?.expirationDate,
                        customerName: card?.customerName || '',
                        brand: card?.brand,
                    },
                },
            };

            const resRecurrentCreate: any =
                await this.paymentAdapter.recurrentCreate(makeRecurrent);

            if (resRecurrentCreate?.err) return resRecurrentCreate;

            const payCardNumber =
                resRecurrentCreate?.payment?.creditCard?.cardNumber;
            const payCardHolder =
                resRecurrentCreate?.payment?.creditCard?.holder;
            const payCardExpirationDate =
                resRecurrentCreate?.payment?.creditCard?.expirationDate;
            const payCardSaveCard =
                resRecurrentCreate?.payment?.creditCard?.saveCard;
            const payCardBrand = resRecurrentCreate?.payment?.creditCard?.Visa;

            const recurrentPaymentId =
                resRecurrentCreate?.payment?.recurrentPayment
                    ?.recurrentPaymentId;
            const reasonCode =
                resRecurrentCreate?.payment?.recurrentPayment?.reasonCode;
            const reasonMessage =
                resRecurrentCreate?.payment?.recurrentPayment?.reasonMessage;
            const nextRecurrency =
                resRecurrentCreate?.payment?.recurrentPayment?.nextRecurrency;
            const interval =
                resRecurrentCreate?.payment?.recurrentPayment?.interval;
            const linkRecurrentPayment =
                resRecurrentCreate?.payment?.recurrentPayment?.link?.href;
            const authorizeNow =
                resRecurrentCreate?.payment?.recurrentPayment?.authorizeNow;

            const persisRecurrency: TRecurrencePayment = {
                residentId: resident?.id,

                value: resRecurrentCreate?.payment?.amount,
                createdAt: new Date(),
                payCardNumber,
                payCardHolder,
                payCardExpirationDate,
                payCardSaveCard,
                payCardBrand,
                recurrentPaymentId,
                reasonCode,
                reasonMessage,
                nextRecurrency,
                interval,
                linkRecurrentPayment,
                authorizeNow,
            };

            const resPersist: any = await this.repository.persist(
                persisRecurrency,
            );

            if (resPersist.err) return rError(resPersist.data);

            const resInvoice: any = await this.invoiceService.Update({
                ...invoice,
            });

            if (resInvoice?.err) return rError(resInvoice?.data);

            console.log(resRecurrentCreate?.payment?.recurrentPayment);

            const response: TRecurrencyStatus = {
                message: 'successful recurrence scheduling',
                invoiceId: invoice?.invoiceId,
                description: resRecurrentCreate?.payment?.softDescriptor,
                nextRecurrency: new Date(
                    resRecurrentCreate?.payment?.recurrentPayment?.nextRecurrency,
                ),
                paidAt: new Date(
                    resRecurrentCreate?.payment?.recurrentPayment?.nextRecurrency,
                ),
                paymentMethod: EnumInvoicePaymentMethod.credit,
                statusInvoice: EnumInvoiceStatus.issued,
            };

            return rSuccess(response);
        } catch (error: any) {
            console.log(99, error);
            return rError({
                message: error?.message,
            });
        }
    };

    public DisableRecurrence = async (resident: TResident) => {
        try {
            const paymentAdapter = new AdapterPayment();
            const paymentRecurrenceRepo = new PaymentRecurrenceRepository();

            const resRecu: any = await paymentRecurrenceRepo.getByResidentId(
                resident.id,
            );

            if (resRecu instanceof Error) return { err: true, data: resRecu };
            if (!resRecu)
                return {
                    err: true,
                    data: {
                        message: 'Recurrence not found.',
                    },
                };

            await paymentAdapter.init(Number(resident.enterpriseId));

            const deactivateRecu: reqRecurrentDeactivate = {
                recurrenceId: resRecu?.data?.row?.recurrentPaymentId,
            };

            const resDeactivate = await paymentAdapter.recurrentDeactivate(
                deactivateRecu,
            );

            if (resDeactivate?.err) {
                await paymentRecurrenceRepo.update({
                    ...resRecu?.data?.row,
                    active: true,
                    updatedAt: new Date(),
                    isDeactivateError: true                    
                });
                return {
                    err: true,
                    data: {
                        message: 'It was not possible deactivate recurrence',
                    },
                };
            }

            const updateRecu: PaymentRecurrence = {
                ...resRecu?.data?.row,
                active: false,
                updatedAt: new Date(),
            };

            const resRecuUpdate = await paymentRecurrenceRepo.update(
                updateRecu,
            );

            if (updateRecu instanceof Error)
                return { err: true, data: updateRecu };

            return {
                err: false,
                data: resRecuUpdate,
            };
        } catch (error: any) {
            console.log('ERR', error);
            return {
                err: false,
                data: {
                    message: error?.message || 'unexpected error',
                },
            };
        }
    };
}
