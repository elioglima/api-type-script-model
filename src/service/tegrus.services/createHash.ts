import { TErrorGeneric, returnError, PromiseExec } from '../../domain/Generics'
import { reqCreateHash, resCreateHash } from '../../domain/Tegrus/TFirstPayment'

/*

*/

const createHash = (data: reqCreateHash): Promise<TErrorGeneric | resCreateHash> => {
    try {
        const hash: string = 'hash 512 base64'
        if (!hash) {
            PromiseExec({
                err: true,
                message: 'Error'
            })
        }
        return PromiseExec({
            invoiceId: data.invoiceId,
            link: `https://payment.jfl?h=${hash}`,
            hash: hash,
        });
    } catch (error: any) {
        return returnError(error?.message);
    }

}

export default createHash 