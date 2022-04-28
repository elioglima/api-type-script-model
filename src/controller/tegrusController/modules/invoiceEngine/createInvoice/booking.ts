import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
// import InvoiceService from '../../../../../service/invoiceService';
import firstPaymentCreateService from '../../../../../service/tegrus.services/firstPaymentCreateService';

import { returnTopic } from './returnTopic';

const booking = async (payload: TInvoice) => {
    console.log('invoice.booking', payload);
    try {
        // const invoiceService = new InvoiceService();

        // const resFindOne = await invoiceService.FindOne(payload.invoiceId);
        // if (!resFindOne?.err && resFindOne?.data)
        //     return returnTopic(
        //         payload,
        //         {
        //             message: 'invoice already exists in the database',
        //         },
        //         true,
        //     );

        const linkInvoice: any = await firstPaymentCreateService(payload);

        if (linkInvoice.err)
            return returnTopic(
                payload,
                { message: linkInvoice.data.message || 'Unexpect Error' },
                true,
            );

        if (!linkInvoice?.data?.hashCredit)
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
        return returnTopic(
            payload,
            { message: error?.message || 'Unexpect Error' },
            true,
        );
    }
};

export { booking };
