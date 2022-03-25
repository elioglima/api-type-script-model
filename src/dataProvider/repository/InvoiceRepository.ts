import debug from 'debug';
import { InvoiceEntity } from '../entity/InvoiceEntity';
import { getConnection } from 'typeorm';
import { TInvoice } from '../../domain/Tegrus';

export class InvoiceRepository {
    private logger = debug('service-api:Invoice');

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
                response => {
                    invoice.id = Number(response.identifiers[0].id);
                    return invoice;
                },
                onRejected => {
                    //this.logger('Error ', onRejected);
                    return {
                        data: {
                            code: onRejected.code,
                            message: onRejected.sqlMessage,
                        },
                    };
                },
            );

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .where('invoice.id = :id', { id })
            .getOne();

    public getAll = async () =>
        await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .orderBy('invoice.id', 'DESC')
            .getMany();

    public update = async (invoice: TInvoice) => {
        return await getConnection()
            .getRepository(InvoiceEntity)
            .createQueryBuilder('invoice')
            .update()
            .set(invoice)
            .where('id = :id', { id: invoice.invoiceId })
            .execute()
            .then(
                () => {
                    return invoice;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };
}
