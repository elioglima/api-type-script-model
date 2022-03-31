import Adapter from '../../domain/Adapter';
import { PaymentRecurrenceRepository } from '../../dataProvider/repository/PaymentRecurrenceRepository';
import { PreRegistrationRepository } from '../../dataProvider/repository/PreRegisterRepository';
import { reqRecurrentDeactivate } from '../../domain/RecurrentPayment';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';

export default async (residentId: number) => {
    try {
        const paymentAdapter = new Adapter();
        const paymentRecurrenceRepo = new PaymentRecurrenceRepository();

        const resRecu: any = await paymentRecurrenceRepo.getById(residentId);

        if (resRecu instanceof Error) return { err: true, data: resRecu };

        if (!resRecu) return { err: true, data: 'Recurrence not found.' };

        const resPreReg = await new PreRegistrationRepository().getById(
            Number(resRecu?.preUserId),
        );

        await paymentAdapter.init(Number(resPreReg?.enterpriseId));

        const deactivateRecu: reqRecurrentDeactivate = {
            recurrenceId: resRecu.recurrenceId,
        };

        const resDeactivate: any = await paymentAdapter.recurrentDeactivate(
            deactivateRecu,
        );

        if (resDeactivate?.err)
            return {
                err: true,
                data: 'It was not possible deactivate recurrece',
            };

        const updateRecu: PaymentRecurrence = {
            ...resRecu,
            updatedAt: new Date(),
        };

        const resRecuUpdate = await paymentRecurrenceRepo.update(updateRecu);

        if (updateRecu instanceof Error) return { err: true, data: updateRecu };

        return resRecuUpdate;
    } catch (error) {
        console.log('ERR', error);
    }
};
