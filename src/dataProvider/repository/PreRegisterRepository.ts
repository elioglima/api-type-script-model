import debug from 'debug';
import { PreRegisterResidentEntity } from '../entity/PreRegisterResidentEntity';
import { TResident } from 'src/domain/Tegrus';
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
                    name: preReg.name,
                    smartphone: preReg.smartphone,
                    nationality: preReg.nationality,
                    nickname: preReg.nickname,
                    email: preReg.email,
                    birthDate: preReg.birthDate,
                    description: preReg.description,
                    document: preReg.document,
                    documentType: preReg.documentType
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
                    return onRejected;
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
