import { InvoiceEntity } from '../entity/InvoiceEntity';
import { getConnection } from 'typeorm';
import { TInvoice, TInvoiceFilter } from '../../domain/Tegrus/TInvoice';

export class InvoiceRepository {
    public persist = async (invoice: TInvoice) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .insert()
            .values([
                {
                    ...invoice,
                },
            ])
            .execute()
            .then(
                () => {
                    return invoice;
                },
                onRejected => {
                    return onRejected;
                },
            );

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

    public Find = (filter: TInvoiceFilter) => {
        const db = getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice');

        db.andWhere('invoice.date >= :startDate', {
            startDate: filter.startDate,
        });
        db.andWhere('invoice.date <= :endDate', {
            endDate: filter.endDate,
        });

        console.log({ filter });

        if (filter.userId) {
            db.andWhere('invoice.userId = :userId', {
                userId: filter.userId,
            });
        } else if (filter.residentId) {
            db.andWhere('invoice.residentId = :residentId', {
                residentId: filter.residentId,
            });
        } else {
            return {
                err: true,
                data: {
                    message: 'invalid parameters',
                },
            };
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

        return db.getMany();
    };

    public update = async (invoice: TInvoice) => {
        return await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .update()
            .set(invoice)
            .where('id = :id', { id: invoice.id })
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
}
