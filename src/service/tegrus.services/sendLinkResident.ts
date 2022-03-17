import { TErrorGeneric, returnError, PromiseExec } from '../../domain/Generics'
import { reqSendLinkResident, resSendLinkResident } from '../../domain/Tegrus/TFirstPayment'

/*

*/


const sendLinkResident = (data: reqSendLinkResident): Promise<resSendLinkResident | TErrorGeneric> => {
    try {

        return PromiseExec({
            success: true,
            message: 'Link enviado com sucesso',
            // link?: reqSendLinkResident,
            data
        });

    } catch (error: any) {
        return returnError(error?.message);
    }

}

export default sendLinkResident 