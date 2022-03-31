import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';
import firstPaymentCreateService from '../../../../../service/tegrus.services/firstPaymentCreateService';
import { returnTopic } from './returnTopic';

const booking = async (payload: TInvoice) => {
    console.log('schedulingRecurrence', payload);

    try {
        const invoiceService = new InvoiceService();
        const resFindOne = await invoiceService.FindOne(payload.invoiceId);

        if (resFindOne.data)
            return returnTopic(
                payload,
                {
                    message: 'invoice already exists in the database',
                },
                true,
            );

        const reqCreate: any = {
            createResident: {
                resident: payload.resident,
                invoice: delete payload.resident && payload,
            },
        };

        const linkInvoice: any = await firstPaymentCreateService(reqCreate);
        if (linkInvoice.err)
            return returnTopic(payload, { message: 'Unexpect Error' }, true);

        return returnTopic(
            payload,
            {
                message: 'Invoice successfully added',
            },
            false,
            linkInvoice,
        );
    } catch (error: any) {
        console.log(error);
        return returnTopic(
            payload,
            { message: error?.message || 'Unexpect Error' },
            true,
        );
    }
};

export { booking };
