import { Request, Response } from 'express';
import { TErrorGeneric, returnError } from '../../../domain/Generics'

type reqInvoiceEngine = {

}

type resInvoiceEngine = {

}

// https://dev.azure.com/Opah/JFL%20-%20Novo%20App/_boards/board/t/JFL%20-%20Novo%20App%20Team/Backlog%20items/?workitem=3247

const invoiceEngine = (req: Request, res: Response): (resInvoiceEngine | TErrorGeneric) => {
    try {
        const body: reqInvoiceEngine = req?.body;
        return res.status(200).json(body);
    } catch (error: any) {
        return res.status(422).json(error);
    }

}

export { invoiceEngine }