import { HashDataEntity } from '../entity/HashDataEntity';
import { hashData } from 'src/domain/Tegrus';
import { getConnection } from 'typeorm';


export class HashDataRepository {

    public persist = async (data: hashData) =>
        await getConnection()
            .getRepository(HashDataEntity)
            .createQueryBuilder('hashData')
            .insert()
            .values([
                {
                    ...data,
                },
            ])
            .execute()
            .then(
                response => {
                    return {
                        err: false,
                        id: Number(response.identifiers[0].id),
                    };
                },
                onRejected => {
                    //this.logger('Error ', onRejected);
                    return {
                        err: true,
                        data: {
                            code: onRejected.code,
                            message: onRejected.sqlMessage
                        }
                    };
                },
            );

    public getByHash = async (hash: string) =>
        await getConnection()
            .getRepository(HashDataEntity)
            .createQueryBuilder('hashData')
            .where('hashData.hash = :hash', { hash })
            .getOne();

}
