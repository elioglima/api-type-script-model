import debug from 'debug';
import { PreRegisterResidentEntity } from '../entity/PreRegisterResidentEntity';
import { TResident } from '../../domain/Tegrus';
import { getConnection } from 'typeorm';

export class PreRegistrationRepository {
    private logger = debug('service-api:PreRegisterRepository');

    public persist = async (preReg: TResident) =>
        await getConnection()
            .getRepository(PreRegisterResidentEntity)
            .createQueryBuilder('preRegisterResident')
            .insert()
            .values([
                {
                    ...preReg
                },
            ])
            .execute()
            .then(
                response => {
                    preReg.id = Number(response.identifiers[0].id);
                    return preReg;
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

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PreRegisterResidentEntity)
            .createQueryBuilder('preRegisterResident')
            .where('preRegisterResident.id = :id', { id })
            .getOne();

    public update = async (preReg: TResident) => {
        return await getConnection()
            .getRepository(PreRegisterResidentEntity)
            .createQueryBuilder('preRegisterResident')
            .update()
            .set(preReg)
            .where('id = :id', { id: preReg.id })
            .execute()
            .then(
                () => {
                    return preReg;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };
}
