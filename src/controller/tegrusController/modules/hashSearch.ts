import { Request, Response } from 'express';

import tegrusServices from '../../../service/tegrus.services';
import { EnMessages } from '../../../enum';

const hashSearch = async (req: Request, res: Response) => {
    try {
        const hash: string = req?.params?.hash;
        if (!hash)
            return res.status(422).json({
                err: true,
                data: EnMessages.Error.HashNotFount,
            });

        const dataRes: any =
            await new tegrusServices.HashSearchService().execute(hash);
        if (dataRes?.err) {
            return res.status(422).json({
                err: true,
                status: 422,
                data: dataRes?.data?.data || dataRes?.data,
            });
        }

        if (!dataRes) {
            return res.status(422).json({
                err: true,
                status: 422,
                data: EnMessages.Error.HashDecodingFailed,
            });
        }

        return res.status(200).json({
            err: false,
            status: 200,
            data: dataRes?.data || dataRes,
        });
    } catch (error: any) {
        return res.status(422).json(EnMessages.Error.UnexpectedError);
    }
};

export { hashSearch };
