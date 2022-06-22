import { ModelEntity } from '../entity/ModelEntity';
import { getConnection } from 'typeorm';

export class HashDataRepository {
    public persist = async (data: any) =>
        await getConnection()
            .getRepository(ModelEntity)
            .save(data)
            .then(
                response => {
                    return {
                        err: false,
                        id: Number(response.id),
                    };
                },
                onRejected => {
                    return {
                        err: true,
                        data: {
                            code: onRejected.code,
                            message: onRejected.sqlMessage,
                        },
                    };
                },
            );

    public getByHash = async (field1: string) =>
        await getConnection()
            .getRepository(ModelEntity)
            .createQueryBuilder('ModelEntity')
            .where('ModelEntity.field1 = :field1', { field1 })
            .orderBy('ModelEntity.id', 'DESC')
            .getOne();

    public update = async (id: number, dataUpdate: any) =>
        await getConnection()
            .getRepository(ModelEntity)
            .createQueryBuilder('ModelEntity')
            .update()
            .set({ ...dataUpdate })
            .where('id = :id', { id: id })
            .execute()
            .then(
                data => {
                    return data;
                },
                onRejected => {
                    return onRejected;
                },
            );
}
