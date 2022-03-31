import { InvoiceEntity } from '../entity/InvoiceEntity';
import { getConnection } from 'typeorm';
import { TInvoice, TInvoiceFilter } from '../../domain/Tegrus';

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
            .leftJoinAndSelect(
                'invoice.resident',
                'preresident',
            )
            .getOne();

    public getByInvoiceId = async (id: number) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .where('invoice.invoiceId = :id', { id })
            .leftJoinAndSelect('invoice.resident', 'resident')
            .getOne();

    public getAll = async () =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .orderBy('invoice.id', 'DESC')
            .getMany();

    public Find = async (payload: TInvoiceFilter) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .find(payload)            
            .then(
                (data) => {
                    return data;
                },
                onRejected => {
                    return onRejected;
                },
            );

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
