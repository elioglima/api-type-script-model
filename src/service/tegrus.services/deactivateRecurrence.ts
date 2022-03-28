import Adapter from '../../domain/Adapter';
import { PaymentRecurrenceRepository } from 'src/dataProvider/repository/PaymentRecurrenceRepository';
import { PreRegistrationRepository } from 'src/dataProvider/repository/PreRegisterRepository';
import { reqRecurrentDeactivate } from 'src/domain/RecurrentPayment';
import { PaymentRecurrence } from 'src/domain/Payment/PaymentRecurrence';

export default async (recurrenceId: string) => {
    try {
        const paymentAdapter = new Adapter();
        const paymentRecurrenceRepo = new PaymentRecurrenceRepository();

        const resRecu: any = await paymentRecurrenceRepo.getByRecurrenceId(
            recurrenceId,
        );

        if (resRecu instanceof Error) return { err: true, data: resRecu };

        if (!resRecu) return { err: true, data: 'Recurrence not found.' };

        const resPreReg = await new PreRegistrationRepository().getById(
            Number(resRecu?.preUserId),
        );

        await paymentAdapter.init(Number(resPreReg?.enterpriseId));

        const deactivateRecu: reqRecurrentDeactivate = {
            recurrenceId: recurrenceId,
        };

        const resDeactivate: any =
            await paymentAdapter.recurrentDeactivate(deactivateRecu); 
            
        console.log("resDeactivate", resDeactivate)

        if (resDeactivate?.err)
            return {
                err: true,
                data: 'It was not possible deactivate recurrece',
            };

        const updateRecu: PaymentRecurrence = {...resRecu, updatedAt: new Date() }

        const resRecuUpdate = await paymentRecurrenceRepo.update(updateRecu)

        if(updateRecu instanceof Error) return {err: true, data: updateRecu}

        return resRecuUpdate
        
    } catch (error) {
        console.log('ERR', error);
    }
};
