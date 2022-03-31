import { Request, Response } from 'express';

const invoiceEnginePrivate = async (req: Request, res: Response) => {
    console.log(req.body);

    res.status(200).json(req.body);
};

export { invoiceEnginePrivate };
