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
                    nationality: preReg.nationality,
                    
                    // paymentCard: paymentRecurrence.paymentCard,
                    // recurrenceId: paymentRecurrence.recurrenceId,
                    // value: paymentRecurrence.value,
                },
            ])
            .execute()
            // .then(
            //     // response => {
            //     //     paymentRecurrence.id = Number(response.identifiers[0].id);
            //     //     return paymentRecurrence;
            //     // },
            //     // onRejected => {
            //     //     this.logger('Error ', onRejected);
            //     //     return onRejected;
            //     // },
            // );

    // public getById = async (id: number) =>
    //     await getConnection()
    //         .getRepository(PaymentRecurrenceEntity)
    //         .createQueryBuilder('paymentRecurrence')
    //         .where('paymentRecurrence.id = :id', { id })
    //         .getOne();

    // public getByRecurrenceId = async (recurrenceId: string) =>
    //     await getConnection()
    //         .getRepository(PaymentRecurrenceEntity)
    //         .createQueryBuilder('paymentRecurrence')
    //         .where('paymentRecurrence.recurrenceId = :recurrenceId', {
    //             recurrenceId,
    //         })
    //         .getOne();

    // public getUserRecurrence = async (userId: number) =>
    //     await getConnection()
    //         .getRepository(PaymentRecurrenceEntity)
    //         .createQueryBuilder('paymentRecurrence')

    //         .where('paymentRecurrence.userId = :userId', { userId })
    //         .getMany();

    // public update = async (paymentRecurrence: PaymentRecurrence) => {
    //     return await getConnection()
    //         .getRepository(PaymentRecurrenceEntity)
    //         .createQueryBuilder('paymentRecurrence')
    //         .update()
    //         .set(paymentRecurrence)
    //         .where('id = :id', { id: paymentRecurrence.id })
    //         .execute()
    //         .then(
    //             () => {
    //                 return paymentRecurrence;
    //             },
    //             onRejected => {
    //                 this.logger('Error ', onRejected);
    //                 return onRejected;
    //             },
    //         );
    // };
}
