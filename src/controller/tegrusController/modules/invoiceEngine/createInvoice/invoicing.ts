import {
    TInvoice,
    TLinkInvoice,
    TResident,
} from '../../../../../domain/Tegrus';
import InvoiceService from '../../../../../service/invoiceService';
import createHash from '../createHash';
import { returnTopic } from './returnTopic';
import RecurrenceService from '../../../../../service/recurrenceService';
import ResidentService from '../../../../../service/residentService';

const invoicing = async (payload: TInvoice) => {
    // const linkInvoice: TLinkInvoice = await createHash(
    //     Number(payload.invoiceId),
    // );

    try {
        if (!payload?.residentId) {
            return returnTopic(
                payload,
                { message: 'resident not found' },
                true,
            );
        }

        const residentService = new ResidentService();
        const resResident: any = await residentService.FindOne(
            payload.residentId,
        );

        if (resResident?.err)
            return returnTopic(payload, resResident?.data, true);

        const resident: TResident = resResident.data;

        const invoiceService = new InvoiceService();
        const resFindOne: any = await invoiceService.FindOneInclude(payload);

        if (resFindOne?.err && !resFindOne?.success) {
            return returnTopic(
                payload,
                { message: resFindOne?.data?.message || 'unexpected error' },
                true,
            );
        }

        const recurrenceService = new RecurrenceService();
        const resRecurrence = await recurrenceService.FindOneResidentId(
            resident.id,
        );

        if (resRecurrence.err)
            return returnTopic(payload, resRecurrence.data, true);

        return returnTopic(
            payload,
            { ...resRecurrence.data, message: 'recurrence is already active' },
            false,
        );
    } catch (error: any) {
        console.log(error);
        return returnTopic(
            payload,
            { message: error?.message || 'unexpected error' },
            true,
        );
    }
};

export { invoicing };
