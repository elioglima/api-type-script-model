import { Request, Response } from 'express';
import InvoiceService from '../../service/InvoiceService';

export const getInvoices = async (req: Request, res: Response) => {
    try {
        console.log(req?.body);
        const invoiceService = new InvoiceService();

        const response = await invoiceService.getAll();
        if (response instanceof Error) {
            return res.status(422).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(422).json(error);
    }
};
