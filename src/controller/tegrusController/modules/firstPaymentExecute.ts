import { Request, Response } from 'express';
import { TErrorGeneric } from '../../../domain/Generics'

type reqFirstPaymentExecute = {

}

type resFirstPaymentExecute = {

}

const firstPaymentExecute = (req: Request, res: Response): (resFirstPaymentExecute | TErrorGeneric) => {
    try {
        const body: reqFirstPaymentExecute = req?.body;

        return res.status(200).json(body);
    } catch (error: any) {
        return res.status(422).json(error);
    }

}

export { firstPaymentExecute }