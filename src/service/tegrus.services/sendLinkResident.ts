import { TErrorGeneric, PromiseExec } from '../../domain/Generics';
import {
    dataSendLinkResident,
    resSendLinkResident,
} from '../../domain/Tegrus/TFirstPayment';

/*

*/

const sendLinkResident = async (
    data: dataSendLinkResident,
) => {
    try {
        const returnReq: resSendLinkResident = {
            success: true,
            message: 'Link enviado com sucesso',
            link: {
                invoiceId: Number(data.invoiceId),
                url: String(data.url)
            },
        };
                
        return returnReq;
    } catch (error: any) {
        throw new Error(error.message);       
    }
};

export default sendLinkResident;
