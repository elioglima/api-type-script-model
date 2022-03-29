import { HashDataEntity } from '../entity/HashDataEntity';
import { hashData } from '../../domain/Tegrus';
import { getConnection } from 'typeorm';

export class HashDataRepository {

    public persist = async (data: hashData) =>
        await getConnection()
            .getRepository(HashDataEntity)
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

    public getByHash = async (hash: string) =>
        await getConnection()
            .getRepository(HashDataEntity)
            .createQueryBuilder('hashData')
            .where('hashData.hash = :hash', { hash })
            .orderBy('hashData.id', 'DESC')                        
            .getOne();

    public update = async (hash: string) =>
        await getConnection()
            .getRepository(HashDataEntity)
            .update({ hash: hash }, { valid: false })
            .then(
                response => {                    
                    return {
                        err: false,
                        rowsAffected: Number(response.affected),
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
}
