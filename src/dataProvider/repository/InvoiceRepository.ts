import { InvoiceEntity } from '../entity/InvoiceEntity';
import { getConnection } from 'typeorm';
import { TInvoice, TInvoiceFilter } from '../../domain/Tegrus/TInvoice';

export class InvoiceRepository {
    public persist = async (invoice: TInvoice) => {
        // startReferenceDate referenceDate
        const dataInsert = {
            date: new Date(),
            invoiceId: invoice?.invoiceId,
            apartmentId: invoice?.apartmentId,
            enterpriseId: invoice?.enterpriseId,
            stepValue: invoice?.stepValue,
            firstPayment: invoice?.firstPayment,
            residentIdenty: invoice?.residentIdenty,

            value: invoice?.value,
            totalValue: invoice?.totalValue,
            commission: invoice?.commission,
            expense: invoice?.expense,
            condominium: invoice?.condominium,
            discount: invoice?.discount,
            tax: invoice?.tax,
            refund: invoice?.refund,
            fine: invoice?.fine,
            fineTicket: invoice?.fineTicket,

            dueDate: invoice?.dueDate,
            description: invoice?.description,
            anticipation: invoice?.anticipation,
            type: invoice?.type,
            paymentMethod: invoice?.paymentMethod,
            statusInvoice: invoice?.statusInvoice,
            isExpired: invoice?.isExpired,

            isRecurrence: invoice?.isRecurrence,
            recurrenceDate: invoice?.recurrenceDate,
            startReferenceDate: invoice?.startReferenceDate,
            endReferenceDate: invoice?.endReferenceDate,
            recurenceNumber: invoice?.recurenceNumber,
            recurenceTotalNumber: invoice?.recurenceTotalNumber,
        };

        console.log(777, 'dataInsert', dataInsert);

        return await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .insert()
            .values([dataInsert])
            .execute()
            .then(
                () => {
                    return invoice;
                },
                onRejected => {
                    return onRejected;
                },
            );
    };

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .where('invoice.invoiceId = :id', { id })
            .leftJoinAndSelect('invoice.residentIdenty', 'preresident')
            .getOne();

    public getByInvoiceId = async (id: number) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .where('invoice.invoiceId = :id', { id })
            .leftJoinAndSelect('invoice.residentIdenty', 'resident')
            .getOne()
            .then(
                data => {
                    return data;
                },
                onRejected => {
                    return onRejected;
                },
            );

    public getAll = async () =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .orderBy('invoice.id', 'DESC')
            .getMany();

    public Find = async (filter: TInvoiceFilter) => {
        console.log(777, filter);
        const db = getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.residentIdenty', 'resident');

        if (filter.startDate && filter.endDate) {
            db.andWhere('invoice.date >= :startDate', {
                startDate: filter.startDate,
            });
            db.andWhere('invoice.date <= :endDate', {
                endDate: filter.endDate,
            });
        }

        db.andWhere('invoice.active = :active', {
            active: true,
        });

        if (filter.invoiceId) {
            db.andWhere('invoice.invoiceId = :invoiceId', {
                invoiceId: filter.invoiceId,
            });
        } else {
            if (filter.userId) {
                db.andWhere('invoice.userId = :userId', {
                    userId: filter.userId,
                });
            } else if (filter.residentId) {
                db.andWhere('invoice.residentIdenty = :residentId', {
                    residentId: filter.residentId,
                });
            }
        }

        if (filter.paymentMethod) {
            db.andWhere('invoice.paymentMethod = :paymentMethod', {
                paymentMethod: filter.paymentMethod,
            });
        }

        if (filter.statusInvoice) {
            db.andWhere('invoice.statusInvoice = :statusInvoice', {
                statusInvoice: filter.statusInvoice,
            });
        }

        return await db.orderBy('invoice.updateDate', 'DESC').getMany();
    };

    public update = async (invoice: any) => {
        const dataUpdate = {
            invoiceId: invoice?.invoiceId,
            ...(invoice?.value ? { value: invoice?.value } : {}),
            ...(invoice?.totalValue ? { totalValue: invoice?.totalValue } : {}),
            ...(invoice?.condominium
                ? { condominium: invoice?.condominium }
                : {}),
            ...(invoice?.discount ? { discount: invoice?.discount } : {}),
            ...(invoice?.tax ? { tax: invoice?.tax } : {}),
            ...(invoice?.refund ? { refund: invoice?.refund } : {}),
            ...(invoice?.fine ? { fine: invoice?.fine } : {}),
            ...(invoice?.fineTicket ? { fineTicket: invoice?.fineTicket } : {}),
            ...(invoice?.dueDate ? { dueDate: invoice?.dueDate } : {}),
            ...(invoice?.description
                ? { description: invoice?.description }
                : {}),
            ...(invoice?.recurrenceDate
                ? { recurrenceDate: invoice?.recurrenceDate }
                : {}),
            ...(invoice?.anticipation
                ? { anticipation: invoice?.anticipation }
                : {}),
            ...(invoice?.type ? { type: invoice?.type } : {}),
            ...(invoice?.paymentMethod
                ? { paymentMethod: invoice?.paymentMethod }
                : {}),
            ...(invoice?.statusInvoice
                ? { statusInvoice: invoice?.statusInvoice }
                : {}),
            ...(invoice?.apartmentId
                ? { apartmentId: invoice?.apartmentId }
                : {}),
            ...(invoice?.startReferenceDate
                ? { startReferenceDate: invoice?.startReferenceDate }
                : {}),
            ...(invoice?.endReferenceDate
                ? { endReferenceDate: invoice?.endReferenceDate }
                : {}),
            ...(invoice?.commission ? { commission: invoice?.commission } : {}),
            ...(invoice?.expense ? { expense: invoice?.expense } : {}),
            ...(invoice?.recurenceNumber
                ? { recurenceNumber: invoice?.recurenceNumber }
                : {}),
            ...(invoice?.recurenceTotalNumber
                ? { recurenceTotalNumber: invoice?.recurenceTotalNumber }
                : {}),
            ...(invoice?.comments ? { comments: invoice?.comments } : {}),
            ...(invoice?.isRefunded ? { isRefunded: invoice?.isRefunded } : {}),
            ...(invoice?.paymentDate
                ? { paymentDate: invoice?.paymentDate }
                : {}),
            ...(invoice?.returnMessage
                ? { returnMessage: invoice?.returnMessage }
                : {}),
            ...(invoice?.paymentId ? { paymentId: invoice?.paymentId } : {}),
            ...(invoice?.tid ? { tid: invoice?.tid } : {}),
            ...(invoice?.returnCode ? { returnCode: invoice?.returnCode } : {}),
            ...(invoice?.referenceCode
                ? { referenceCode: invoice?.referenceCode }
                : {}),
        };

        console.log('dataUpdate', dataUpdate);

        return await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .update()
            .set({ ...dataUpdate, atUpdate: true, updateDate: new Date() })
            .where('invoiceId = :invoiceId', { invoiceId: invoice.invoiceId })
            .execute()
            .then(
                data => {
                    return data;
                },
                onRejected => {
                    return onRejected;
                },
            );
    };

    public getByResidentId = async (residentId: number) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.residentIdenty', 'resident')
            .where('invoice.residentIdenty = :residentId', {
                residentId: residentId,
            })
            .getMany()
            .then(
                data => {
                    return data;
                },
                onRejected => {
                    return onRejected;
                },
            );

    public getByPaymentId = async (id: number) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .where('invoice.invoiceId = :id', { id })
            .getOne()
            .then(
                data => {
                    return data;
                },
                onRejected => {
                    return onRejected;
                },
            );
}
