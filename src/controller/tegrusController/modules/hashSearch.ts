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

        const data = await new tegrusServices.HashSearchService().execute(hash);

        if (data instanceof Error) {
            logger('Error', data.message);
            return res.status(500).json({
                err: true,
                data: {
                    message: data.message,
                },
            });
        }

        if (!data) {
            logger('Error', 'Nothing was found');
            return res.status(404).json({
                err: true,
                data: {
                    message: 'Nothing was found',
                },
            });
        }

        // localizar dados do pre cadastro

        return res.status(200).json(data);
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { hashSearch };
