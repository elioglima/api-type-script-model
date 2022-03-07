import { Request, Response } from 'express';
import { TErrorGeneric, returnError } from '../../../domain/Generics'

/*

*/

type reqCancelContract = {

}

type resCancelContract = {

}

const cancelContract = (req: Request, res: Response): (resCancelContract | TErrorGeneric) => {
    try {
        const body: reqCancelContract = req?.body;
        return res.status(200).json(body);
    } catch (error: any) {
        return res.status(422).json(error);
    }

}

export { cancelContract }