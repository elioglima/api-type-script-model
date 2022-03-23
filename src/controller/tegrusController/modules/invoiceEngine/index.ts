import { Request, Response } from 'express';
import { TInvoiceEngineReq } from '../../../../domain/Tegrus/TInvoiceEngine'


import { createInvoice } from './createInvoice'
import { deleteInvoice } from './deleteInvoice'
import { statusInvoice } from './statusInvoice'
import { updateInvoice } from './updateInvoice'

const invoiceEngine = async (req: Request, res: Response) => {
    try {
        const toReceive: TInvoiceEngineReq = req?.body;
        if (toReceive?.createResident) {
            const response: any = await createInvoice(toReceive)
            return res.status(response?.status || 422).json(response?.data);

        } else if (toReceive?.deleteInvoice) {
            const response: any = await deleteInvoice(toReceive)
            return res.status(response?.status || 422).json(response?.data);

        } else if (toReceive?.statusInvoice) {
            const response: any = await statusInvoice(toReceive)
            return res.status(response?.status || 422).json(response?.data);

        } else if (toReceive?.updateInvoice) {
            const response: any = await updateInvoice(toReceive)
            return res.status(response?.status || 422).json(response?.data);
        }

        return res.status(200).json(toReceive);
    } catch (error: any) {
        return res.status(422).json(error);
    }

}

export { invoiceEngine }