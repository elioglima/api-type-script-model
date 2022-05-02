import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';
import createHash from '../createHash';
import { returnTopic } from './returnTopic';

const spotInvoiceFine = async (payload: TInvoice) => {
    console.log('invoice.spotInvoiceFine', payload);
    const linkInvoice: TLinkInvoice = await createHash(
        Number(payload.invoiceId),
    );

    if (linkInvoice.err)
        return returnTopic(
            payload,
            {
                message: 'error generating hash for link',
            },
            true,
        );

    try {
        const invoiceService = new InvoiceService();
        const resFindOneInclude = await invoiceService.FindOneInclude(payload);
        if (resFindOneInclude.err)
            return returnTopic(
                payload,
                {
                    message: 'invoice is already in the database',
                },
                true,
            );

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
            { message: error?.message || 'Erro inesperado' },
            true,
        );
    }
};

export { spotInvoiceFine };
