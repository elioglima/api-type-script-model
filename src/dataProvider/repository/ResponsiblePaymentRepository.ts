import debug from 'debug';
import { ResponsiblePaymentEntity } from '../entity/ResponsiblePaymentEntity';
import { TResponsiblePayment } from '../../domain/Tegrus';
import { getConnection } from 'typeorm';

export class ResponsiblePaymentRepository {
    private logger = debug('service-api:PreRegisterRepository');

    public persist = async (data: TResponsiblePayment) => {
        console.log('persist', data);
        let dataWrite: TResponsiblePayment = {
            apartmentId: data?.apartmentId,
            enterpriseId: data?.enterpriseId,
            name: data?.name,
            typeDocument: data?.typeDocument,
            document: data?.document,
            mail: data?.mail,
        };

        return await getConnection()
            .getRepository(ResponsiblePaymentEntity)
            .createQueryBuilder('responsiblePayment')
            .insert()
            .values([
                {
                    ...dataWrite,
                },
            ])
            .execute()
            .then(
                response => {
                    dataWrite.id = Number(response.identifiers[0].id);
                    return dataWrite;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return {
                        err: true,
                        data: {
                            code: onRejected.code,
                            message: onRejected.sqlMessage,
                        },
                    };
                },
            );
    };

    public update = async (data: TResponsiblePayment) => {
        let dataWrite: TResponsiblePayment = {
            id: data?.id,
            name: data?.name,
            typeDocument: data?.typeDocument,
            document: data?.document,
            mail: data?.mail,
        };

        return await await getConnection()
            .getRepository(ResponsiblePaymentEntity)
            .createQueryBuilder('responsiblePayment')
            .update()
            .set(dataWrite)
            .where('id = :id', { id: dataWrite.id })
            .execute()
            .then(
                () => {
                    return dataWrite;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return {
                        err: true,
                        data: {
                            code: onRejected.code,
                            message: onRejected.sqlMessage,
                        },
                    };
                },
            );
    };

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(ResponsiblePaymentEntity)
            .createQueryBuilder('responsiblePayment')
            .where('responsiblePayment.id = :id', { id })
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
