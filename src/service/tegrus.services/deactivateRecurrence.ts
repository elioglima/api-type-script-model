import Adapter from '../../domain/Adapter';
import { PaymentRecurrenceRepository } from '../../dataProvider/repository/PaymentRecurrenceRepository';
import { reqRecurrentDeactivate } from '../../domain/RecurrentPayment';
import { PaymentRecurrence } from '../../domain/Payment/PaymentRecurrence';
import { TInvoice } from '../../domain/Tegrus';

export default async (invoice: TInvoice) => {
    try {
        const paymentAdapter = new Adapter();
        const paymentRecurrenceRepo = new PaymentRecurrenceRepository();

        const resRecu: any = await paymentRecurrenceRepo.getById(
            invoice.resident.id,
        );
        if (resRecu instanceof Error) return { err: true, data: resRecu };
        if (!resRecu)
            return {
                err: true,
                data: {
                    message: 'Recurrence not found.',
                },
            };

        await paymentAdapter.init(Number(invoice.resident.enterpriseId));
        const deactivateRecu: reqRecurrentDeactivate = {
            recurrenceId: resRecu.recurrenceId,
        };

        const resDeactivate: any = await paymentAdapter.recurrentDeactivate(
            deactivateRecu,
        );

        if (resDeactivate?.err)
            return {
                err: true,
                data: {
                    message: 'It was not possible deactivate recurrece',
                },
            };

        const updateRecu: PaymentRecurrence = {
            ...resRecu,
            updatedAt: new Date(),
        };

        const resRecuUpdate = await paymentRecurrenceRepo.update(updateRecu);

        if (updateRecu instanceof Error) return { err: true, data: updateRecu };

        return {
            err: false,
            data: resRecuUpdate,
        };
    } catch (error: any) {
        console.log('ERR', error);
        return {
            err: false,
            data: {
                message: error?.message || 'unexpected error',
            },
        };
    }
};
