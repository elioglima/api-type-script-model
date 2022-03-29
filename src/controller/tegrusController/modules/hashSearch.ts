import debug from 'debug';
import { Request, Response } from 'express';

import tegrusServices from '../../../service/tegrus.services';

const hashSearch = async (req: Request, res: Response) => {
    const logger = debug('payment-api:PaymentController');

    try {
        const hash: string = req?.params?.hash;
        if (!hash)
            return res.status(400).json({
                err: true,
                data: {
                    message: 'No hash was sent.',
                },
            });

        const dataRes: any = await new tegrusServices.HashSearchService().execute(hash);
        //console.log("data", data instanceof Error)
        if (dataRes?.err) {
            logger('Error', dataRes?.data);
            return res.status(500).json({
                err: true,
                status: 500,
                data: {
                    message: dataRes?.data,
                },
            });
        }

        if (!data) {
            logger('Error', 'Nothing was found');
            return res.status(404).json({
                err: true,
                status: 404,
                data: {
                    message: 'Nothing was found',
                },
            });
        }

        return res.status(200).json({
            err: false,
            status: 200,
            data: data,
        });
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { hashSearch };
