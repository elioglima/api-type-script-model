import {
    reqCreateHash,
    resCreateHash,
} from '../../domain/Tegrus/TFirstPayment';

import crypto from 'crypto';
/*

*/

const createHash = (data: reqCreateHash): resCreateHash => {
    try {
        const hash: string = crypto
            .createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex');
        if (!hash) {
            return {
                err: true,
                message: 'Error',
            };
        }
        return {
            invoiceId: data.invoiceId,
            link: `https://payment.jfl?h=${hash}`,
            hash: hash,
        };
    } catch (error: any) {
        return {
            err: true,
            message: error?.message,
        };
    }
};

export default createHash;
