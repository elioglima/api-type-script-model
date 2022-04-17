import debug from 'debug';
import { Request, Response } from 'express';

import tegrusServices from '../../../service/tegrus.services';

const hashSearch = async (req: Request, res: Response) => {
    const logger = debug('payment-api:PaymentController');

    try {
        const hash: string = req?.params?.hash;
        if (!hash)
            return res.status(422).json({
                err: true,
                data: {
                    message: 'No hash was sent.',
                },
            });

        const dataRes: any =
            await new tegrusServices.HashSearchService().execute(hash);
        if (dataRes?.err) {
            logger('Error', dataRes?.data);
            return res.status(422).json({
                err: true,
                status: 422,
                data: dataRes?.data?.data || dataRes?.data,
            });
        }

        if (!dataRes) {
            logger('Error', 'Nothing was found');
            return res.status(422).json({
                err: true,
                status: 422,
                data: {
                    message: 'Nothing was found',
                },
            });
        }

        return res.status(200).json({
            err: false,
            status: 200,
            data: dataRes?.data || dataRes,
        });
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { hashSearch };
