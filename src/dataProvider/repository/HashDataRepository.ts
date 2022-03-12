import debug from 'debug';
import { HashDataEntity } from '../entity/HashDataEntity';
import { hashData } from 'src/domain/Tegrus';
import { getConnection } from 'typeorm';


export class HashDataRepository {
    private logger = debug('service-api:HashDataRepository');

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
                    return onRejected;
                },
            );

    public getByHash = async (hash: string) =>
        await getConnection()
            .getRepository(HashDataEntity)
            .createQueryBuilder('hashData')
            .where('hashData.hash = :hash', { hash })
            .getOne();

}
