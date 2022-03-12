import { TErrorGeneric, returnError, PromiseExec } from '../../domain/Generics'
import { reqCreateHash, resCreateHash } from '../../domain/Tegrus/TFirstPayment'

import crypto from 'crypto'
/*

*/

const createHash = (data: reqCreateHash): Promise<TErrorGeneric | resCreateHash> => {
    try {
        const hash: string = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
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