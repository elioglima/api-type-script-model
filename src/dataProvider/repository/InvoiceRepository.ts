import { InvoiceEntity } from '../entity/InvoiceEntity';
import { getConnection } from 'typeorm';
import { TInvoice } from '../../domain/Tegrus';

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
            .where('invoice.id = :id', { id })
            .leftJoinAndSelect(
                'invoice.PreRegisterResidentEntity',
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

    public Find = async (where: string, data: Object) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .where(where, data)
            .leftJoinAndSelect(
                'invoice.PreRegisterResidentEntity',
                'preresident',
            )
            .getOne();

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
