import debug from 'debug';
import {
    TRecurrence,
    TRecurrenceCard,
    TResident,
    TInvoice,
    TRecurrenceSchedule,
    TRecurrencePayment,
} from '../../domain/Tegrus';
import { reqRecurrentDeactivate } from '../../domain/RecurrentPayment';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';
import { rError, rSuccess } from '../../utils';
import { PaymentRecurrenceRepository } from '../../dataProvider/repository/PaymentRecurrenceRepository';
import AdapterPayment from '../../domain/AdapterPayment';
import InvoiceService from '../invoiceService';
import ResidentService from '../residentService';
import { EnumInvoicePaymentMethod } from '../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceStatus } from '../../domain/Tegrus/EnumInvoiceStatus';
import { defaultReturnMessage } from './../../utils/returns';
import { refundRecurrencePayment } from '../../domain/Payment/PaymentRecurrence';
import moment from 'moment';

export default class RecurrenceService {
    private logger = debug('payment-api:RecurrenceService');
    private repository = new PaymentRecurrenceRepository();
    private invoiceService = new InvoiceService();
    private paymentAdapter = new AdapterPayment();
    private residentService = new ResidentService();

    public FindOneResidentId = async (residenteId: number) => {
        try {
            this.logger(`Find One FindOneResidentId`);

            const checkExists: any = await this.repository.getByResidentId(
                residenteId,
            );

            if (checkExists?.err)
                return rError({
                    message: 'recurrence error find',
                });

            if (!checkExists?.data?.row)
                return rSuccess({
                    message: 'recurrence not found',
                });

            const resResident: any = await this.residentService.FindOne(
                residenteId,
            );
            if (resResident?.err) return rError(resResident.data);

            const resident: TResident = resResident.data;

            // consultar recorrencia pelo id

            const resAdapter = await this.paymentAdapter.init(
                Number(resident.enterpriseId),
            );
            if (resAdapter?.err) return rError(resAdapter.data);

            const recurrentPaymentId: string =
                checkExists?.data?.row?.recurrentPaymentId;

            const resRecurrence: any = await this.paymentAdapter.recurrenceFind(
                {
                    recurrentPaymentId,
                },
            );

            if (resRecurrence instanceof Error) return rError(resRecurrence);

            if (!resRecurrence?.recurrentPayment)
                return rError({
                    ...resRecurrence,
                    message: 'Failed to query a recurrence in Cielo',
                });

            return rSuccess(resRecurrence?.recurrentPayment);
        } catch (error: any) {
            return rError({
                message: error?.message,
            });
        }
    };

    public DisableIsExist = async (resident: TResident) => {
        try {
            this.logger(`Find One Disable`);

            const checkExists: {
                err?: boolean;
                data?: any | TRecurrence;
                message?: string;
            } = await this.FindOneResidentId(resident.id);

            if (checkExists?.err)
                return rError({
                    message:
                        'error when querying the recurrence in the database',
                });

            const resCreateAdapter = await this.paymentAdapter.init(
                resident.enterpriseId,
            );
            if (checkExists?.err) return rError(resCreateAdapter.data);

            const recurrenceId = checkExists.data.recurrenceId;

            const resRecurrentDeactivate: any =
                await this.paymentAdapter.recurrentDeactivate({ recurrenceId });

            if (resRecurrentDeactivate instanceof Error)
                return rError({
                    message: 'error deleting local recurrence',
                });

            if (resRecurrentDeactivate?.err) return resRecurrentDeactivate;

            const resDelete: TRecurrence = await this.repository.delete(
                checkExists.data.id,
            );

            if (!resDelete)
                return rError({
                    message: 'error deleting local recurrence',
                });

            return rSuccess(checkExists.data);
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

            console.log({ recurrence });
            const makeRecurrent: any = {
                MerchantOrderId: invoice?.invoiceId
                    .toString()
                    .concat(
                        moment()
                            .format('YYYYMMDDHH:mm:ss')
                            .concat(card?.cardNumber.slice(-4)),
                    ),
                Customer: {
                    Name: resident?.name,
                },
                payment: {
                    Type: 'CreditCard',
                    Amount: invoice?.totalValue.toString().replace('.', ''),
                    Installments: 1,
                    SoftDescriptor: 'Recorrencia JFL',
                    RecurrentPayment: {
                        AuthorizeNow: true,
                        EndDate: recurrence.endDateContract,
                        Interval: 'Monthly',
                    },
                    CreditCard: {
                        // customerName: card?.customerName || '',
                        CardNumber: card?.cardNumber,
                        Holder: card?.holder,
                        ExpirationDate: card?.expirationDate,
                        Brand: card?.brand,
                        SecurityCode: String(card.securityCode),
                        SaveCard: true,
                    },
                },
            };

            console.log(123, makeRecurrent);
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
                reasonCode:
                    resRecurrentCreate?.payment?.recurrentPayment?.reasonCode,
                reasonMessage:
                    resRecurrentCreate?.payment?.recurrentPayment
                        ?.reasonMessage,
                nextRecurrency,
                interval,
                linkRecurrentPayment,
                authorizeNow,
            };

            const returnCode = resRecurrentCreate?.payment?.returnCode;
            const returnMessage = resRecurrentCreate?.payment?.returnMessage;
            const resDefaultReturnMessage: any =
                defaultReturnMessage(returnCode);

            const recurreceError =
                persisRecurrency?.reasonCode == undefined ||
                ![0, 4].includes(
                    Number(
                        resRecurrentCreate?.payment?.recurrentPayment
                            ?.reasonCode,
                    ),
                );

            if (![0, 4].includes(Number(returnCode))) {
                const response: any = {
                    recurrence: {
                        err: recurreceError,
                        ...(recurreceError
                            ? {
                                  message:
                                      'Error return in Cielo when scheduling the recurrence',
                              }
                            : {}),
                        ...resRecurrentCreate?.payment?.recurrentPayment,
                    },
                    invoiceId: invoice?.invoiceId,
                    description: resRecurrentCreate?.payment?.softDescriptor,
                    returnCode,
                    returnMessage,
                    referenceCode: resDefaultReturnMessage.code,
                    message: resDefaultReturnMessage.message,
                };

                return rError({
                    ...response,
                });
            }

            console.log('atuolizou o pagamento');
            const resInvoice: any = await this.invoiceService.Update({
                ...invoice,
            });

            if (resInvoice?.err) return rError(resInvoice?.data);

            const paymentSccess: any = {
                returnCode,
                returnMessage,
                nextRecurrency: new Date(
                    resRecurrentCreate?.payment?.recurrentPayment?.nextRecurrency,
                ),
                paidAt: new Date(
                    resRecurrentCreate?.payment?.recurrentPayment?.nextRecurrency,
                ),
                paymentMethod: EnumInvoicePaymentMethod.credit,
                statusInvoice: EnumInvoiceStatus.paid,
                invoiceId: invoice?.invoiceId,
                description: resRecurrentCreate?.payment?.softDescriptor,
                tid: resRecurrentCreate?.payment?.tid,
                paymentDate: resRecurrentCreate?.payment?.receivedDate,
                paymentId: resRecurrentCreate?.payment?.paymentId,
            };

            if (recurreceError) {
                console.log('erro ao gerar a recorrencia');

                const response: any = {
                    recurrence: {
                        err: recurreceError,
                        message:
                            'successful refundable payment, (return error in retribution)',
                        ...resRecurrentCreate?.payment?.recurrentPayment,
                    },
                    ...paymentSccess,
                };

                return rSuccess(response);
            }

            // TO-DO-BETO
            // caso ja exista update

            const resPersist: any = await this.repository.persist(
                persisRecurrency,
            );
            if (resPersist.err) return rError(resPersist.data);

            const response: any = {
                recurrence: {
                    err: false,
                    ...resRecurrentCreate?.payment?.recurrentPayment,
                },
                ...paymentSccess,
                message: 'successful recurrence scheduling',
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
                    isDeactivateError: true,
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
                isDeactivateError: false,
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

    public FindOneDisabled = async (invoiceId: number) => {
        this.logger(`Find One FindOneDisabled`);

        const resInvoiceId: any = await this.invoiceService.FindOneDisabled(
            invoiceId,
        );

        if (resInvoiceId instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        if (resInvoiceId.err) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        if (!resInvoiceId.data) {
            return {
                err: true,
                data: {
                    message: 'Invoice not found',
                },
            };
        }

        return {
            err: false,
            data: resInvoiceId.data,
        };
    };

    private recurrenceCalculator = async (invoiceData: TInvoice) => {
        let invoice = invoiceData;

        if (!invoiceData.isRecurrence) return invoice;

        const dateTemp =
            invoice?.recurrenceDate || invoice?.endReferenceDate || undefined;
        const dateStart = moment(invoice?.startReferenceDate);
        const dateEnd = moment(invoice?.endReferenceDate);
        const tempTotalRecurrence = moment.duration(dateEnd.diff(dateStart));

        const recurenceTotalNumber = Number(
            tempTotalRecurrence.asMonths().toFixed(),
        );

        const dateVerify = moment(dateTemp);
        const duration = moment.duration(dateVerify.diff(dateStart));
        const recurenceNumber = Number(duration.asMonths().toFixed());

        invoice = { ...invoice, recurenceTotalNumber, recurenceNumber };
        return invoice;
    };

    public RefundRecurrence = async (invoiceId: number, comments: string) => {
        try {
            const resInvoice: any = await this.invoiceService.FindOne(
                invoiceId,
            );

            console.log('resInvoice', resInvoice);

            if (!resInvoice.data)
                return rError({
                    message: 'Invoice not found',
                });

            if (resInvoice.err)
                return rError({
                    message: resInvoice?.data?.message,
                });

            let { data: dataInvoice } = resInvoice;

            if (dataInvoice.statusInvoice != EnumInvoiceStatus.paid)
                return rError({
                    message: 'This recurrence was not paid yet.',
                });

            if (dataInvoice.paymentMethod != EnumInvoicePaymentMethod.credit)
                return rError({
                    message: 'This recurrence not bought by a credit card.',
                });

            if (!dataInvoice.isRecurrence)
                return await this.RefundSpot(dataInvoice, comments);

            if (!dataInvoice.recurenceNumber)
                dataInvoice = await this.recurrenceCalculator(dataInvoice);

            const residentId = dataInvoice?.residentIdenty?.id;

            const recurrence = await this.repository.getByPreUserId(residentId);

            if (recurrence.length == 0)
                return rError({
                    message: 'unexpected error',
                });

            if (recurrence instanceof Error)
                return rError({
                    message: 'unexpected error',
                });

            const paymentAdapter = new AdapterPayment();
            await paymentAdapter.init(
                dataInvoice?.residentIdenty?.enterpriseId,
            );

            const resRecurrence: any = await paymentAdapter.recurrenceFind({
                recurrentPaymentId: recurrence?.recurrentPaymentId,
            });

            if (
                resRecurrence.recurrentPayment.recurrentTransactions.length <
                dataInvoice.recurenceNumber - 1
            )
                return rError({
                    message:
                        'RecurrenceNumber is higher than recurrence already paid',
                });

            const stepPay =
                resRecurrence.recurrentPayment.recurrentTransactions[
                    dataInvoice.recurenceNumber - 1
                ].paymentId;

            const resRefunded: any = await paymentAdapter.refoundPayment({
                paymentId: stepPay,
                amount: dataInvoice.value * 100,
            });

            if (resRefunded instanceof Error)
                return rError({
                    message: 'Unexpected Error',
                });

            if (![0, 6].includes(Number(resRefunded.returnCode)))
                return rError({
                    message: 'Error to refund',
                });

            const updateInvoice = await this.invoiceService.Update({
                ...dataInvoice,
                comments,
                isRefunded: true,
                statusInvoice: EnumInvoiceStatus.refunded,
            });

            if (updateInvoice.err)
                return rError({
                    message: updateInvoice.data.message,
                });

            const resRefund: refundRecurrencePayment = {
                invoiceId: dataInvoice.invoiceId,
                reason: comments,
            };

            return resRefund;
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

    private RefundSpot = async (dataInvoice: TInvoice, comments: string) => {
        try {
            const paymentAdapter = new AdapterPayment();
            await paymentAdapter.init(
                dataInvoice?.residentIdenty?.enterpriseId,
            );

            const resRefunded: any = await paymentAdapter.refoundPayment({
                paymentId: String(dataInvoice?.paymentId),
                amount: dataInvoice.value * 100,
            });

            if (resRefunded instanceof Error)
                return rError({
                    message: 'Unexpected Error',
                });

            if (![0, 6].includes(Number(resRefunded.returnCode)))
                return rError({
                    message: 'Error to refund',
                });

            const updateInvoice = await this.invoiceService.Update({
                ...dataInvoice,
                comments,
                isRefunded: true,
                statusInvoice: EnumInvoiceStatus.refunded,
            });

            if (updateInvoice.err)
                return rError({
                    message: updateInvoice.data.message,
                });

            const resRefund: refundRecurrencePayment = {
                invoiceId: dataInvoice.invoiceId,
                reason: comments,
            };

            return resRefund;
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

    public changeCardRecurrence = async () => {
        
    };
}
