import debug from 'debug';
import { PreRegisterResidentEntity } from '../../dataProvider/entity/PreRegisterResidentEntity';
import { TResident } from '../../domain/Tegrus';
import { getConnection } from 'typeorm';

export class PreRegistrationRepository {
    private logger = debug('service-api:PreRegisterRepository');

    public persist = async (preReg: TResident) => {
        const data = {
            id: preReg.id,
            name: preReg.name,
            nationality: preReg.nationality,
            nickname: preReg.nickname,
            email: preReg.email,
            birthDate: preReg?.birthDate,
            smartphone: preReg.smartphone,
            documentType: preReg.documentType,
            document: preReg.document,
            description: preReg.description,
            apartmentId: preReg.apartmentId,
            enterpriseId: preReg.enterpriseId,
            contractCode: preReg.contractCode,
            startDateContract: preReg.startDateContract,
            endDateContract: preReg.endDateContract,
            recurrenceId: preReg.recurrenceId,
            startReferenceDate: preReg.startReferenceDate,
            endReferenceDate: preReg.endReferenceDate,
            responsiblePayment: preReg.responsiblePayment,
        };
        return await getConnection()
            .getRepository(PreRegisterResidentEntity)
            .createQueryBuilder('preRegisterResident')
            .insert()
            .values([data])
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
    };

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PreRegisterResidentEntity)
            .createQueryBuilder('preRegisterResident')
            .where('preRegisterResident.id = :id', { id })
            .getOne()
            .then(
                data => {
                    return data;
                },
                onRejected => {
                    return onRejected;
                },
            );

    public getByResidentId = async (residentId: number) =>
        await getConnection()
            .getRepository(PreRegisterResidentEntity)
            .createQueryBuilder('preRegisterResident')
            .where('preRegisterResident.residentId = :residentId', {
                residentId,
            })
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
