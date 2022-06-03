import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
// import InvoiceService from '../../../../../service/invoiceService';
import firstPaymentCreateService from '../../../../../service/tegrus.services/firstPaymentCreateService';

import { returnTopic } from './returnTopic';

const booking = async (payload: TInvoice) => {
    console.log('invoice.booking', payload);
    try {
        const linkInvoice: any = await firstPaymentCreateService(payload);

        if (linkInvoice.abort) {
            return returnTopic(payload, linkInvoice, true);
        }

        if (linkInvoice.err)
            return returnTopic(
                payload,
                { message: linkInvoice.data.message || 'Unexpect Error' },
                true,
            );

        if (!linkInvoice?.hashCredit)
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
