import { TInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { EnumInvoicePaymentMethod } from '../../../../../domain/Tegrus/EnumInvoicePaymentMethod';

import InvoiceService from '../../../../../service/invoiceService';
import firstPaymentCreateService from '../../../../../service/tegrus.services/firstPaymentCreateService';

const booking = async (payload: TInvoice) => {
    console.log('schedulingRecurrence', payload);  
    let linkInvoice: any = null
    const returnTopic = (
        response: any,
        err: boolean = false,
        message: string = 'Success',
    ) => {
        return {
            status: err ? 422 : 200,
            err,
            ...(message ? { message } : {}),
            data: {
                createInvoice: {
                    ...(payload ? { ...payload } : {}),
                    returnOpah: {
                        err,
                        spotInvoice: true,
                        anticipation: false,
                        firstPayment: false,
                        type: payload.type,
                        status: err ? 'failed' : 'success',
                        messageError: message || undefined,
                        ...(message ? { message } : {}),
                        ...(response ? { ...response } : {}),
                        ...(EnumInvoicePaymentMethod.credit ==
                        payload.paymentMethod
                            ? { linkInvoice }
                            : {}),
                    },
                },
            },
        };
    };
    try {      
        const invoiceService = new InvoiceService();
        const resFindOne = await invoiceService.FindOne(payload.invoiceId);
        
        if (resFindOne.data)
            return returnTopic({
                message: 'invoice already exists in the database',
            });

        const reqCreate:any = {
            createResident:{
                resident: payload.resident,
                invoice: delete payload.resident && payload,
            }
        }

        linkInvoice = await firstPaymentCreateService(reqCreate);     

        if(linkInvoice.err) return returnTopic({}, true, 'Unexpect Error');

        return returnTopic({
            message: 'Invoice successfully added',
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Unexpect Error');
    }
};

export { booking };
