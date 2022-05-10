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

        if (filter.userId) {
            db.andWhere('invoice.userId = :userId', {
                userId: filter.userId,
            });
        } else if (filter.residentId) {
            db.andWhere('invoice.residentIdenty = :residentId', {
                residentId: filter.residentId,
            });
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

        return await db.orderBy('invoice.atUpdate', 'DESC').getMany();
    };

    public update = async (invoice: TInvoice) => {
        const dataUpdate = {
            value: invoice?.value,
            totalValue: invoice?.totalValue,
            condominium: invoice?.condominium,
            discount: invoice?.discount,
            tax: invoice?.tax,
            refund: invoice?.refund,
            fine: invoice?.fine,
            fineTicket: invoice?.fineTicket,
            dueDate: invoice?.dueDate,
            description: invoice?.description,
            recurrenceDate: invoice?.recurrenceDate,
            anticipation: invoice?.anticipation,
            type: invoice?.type,
            paymentMethod: invoice?.paymentMethod,
            statusInvoice: invoice?.statusInvoice,
            apartmentId: invoice?.apartmentId,
            isExpired: invoice?.isExpired,
            startReferenceDate: invoice?.startReferenceDate,
            endReferenceDate: invoice?.endReferenceDate,
            commission: invoice?.commission,
            expense: invoice?.expense,
            recurenceNumber: invoice?.recurenceNumber,
            recurenceTotalNumber: invoice?.recurenceTotalNumber,
            comments: invoice?.comments,
            isRefunded: invoice?.isRefunded,
            paymentDate: invoice?.paymentDate,
            returnMessage: invoice?.returnMessage,
            paymentId: invoice?.paymentId,
            tid: invoice?.tid,
            returnCode: invoice?.returnCode,
            referenceCode: invoice?.referenceCode,
        };

        console.log('dataUpdate', dataUpdate);

        return await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .update()
            .set({ ...dataUpdate, atUpdate: true })
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
}
