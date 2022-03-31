import crypto from 'crypto';
import moment from 'moment';

import {
    reqCreateHash,
    resCreateHash,
} from '../../../../../domain/Tegrus/TFirstPayment';

import { hashData } from './../../../../../domain/Tegrus/TFirstPayment';
import { TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import { HashDataRepository } from './../../../../../dataProvider/repository/HashDataRepository';

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
            hash: hash,
        };
    } catch (error: any) {
        return {
            err: true,
            message: error?.message,
        };
    }
};

const createHashInvoice = async (invoiceId: number) => {
    try {
        const HashRep = new HashDataRepository();

        const dataHash: reqCreateHash = {
            invoiceId: invoiceId,
        };

        const resultHash: resCreateHash = await createHash(dataHash);

        if (resultHash?.err) {
            return {
                err: true,
                data: resultHash,
            };
        }

        if (!resultHash?.hash) {
            return {
                err: true,
                data: {
                    message: 'Error hash not created',
                },
            };
        }

        const hashD: hashData = {
            hash: String(resultHash.hash),
            lifeTime: moment().add('days', 3).toDate(),
            invoiceId,
        };

        const resHashRep = await HashRep.persist(hashD);

        if (resHashRep?.err) {
            return resHashRep;
        }

        const linkInvoice: TLinkInvoice = {
            invoiceId,
            hashCredit: resultHash?.hash,
        };

        return linkInvoice;
    } catch (error: any) {
        return {
            err: true,
            message: error?.message || 'erro inesperado',
        };
    }
};

export default createHashInvoice;
