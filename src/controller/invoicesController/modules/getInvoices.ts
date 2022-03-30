import { Request, Response } from 'express';
import InvoiceService from '../../../service/invoiceService';
import { TInvoiceFilter } from 'src/domain/Tegrus';

export const getInvoices = async (req: Request, res: Response) => {
    try {
        const {
            startDate,
            endDate,
            residentId,
            userId,
            invoiceId,
            paymentMethod,
            statusInvoice,
        }: any = req?.query;

        const invoicesFilter: TInvoiceFilter = {
            startDate,
            endDate,
            residentId,
            userId,
            invoiceId,
            paymentMethod,
            statusInvoice,
        };

        const invoiceService = new InvoiceService();
        const response: any = await invoiceService.Find(invoicesFilter);
        if (response.err) {
            return res.status(422).json(response);
        }

        const result = response?.data?.map((m: any) => ({
            id: m.id,
            date: m.date,
            invoiceId: m.invoiceId,
            residentId: m.residentId,
            idUser: m.idUser,
            description: m.description,
            paymentMethod: m.paymentMethod,
            statusInvoice: m.statusInvoice,
            value: m.value,
        }));

        return res.status(200).json({
            err: true,
            data: result,
        });
    } catch (error) {
        return res.status(422).json(error);
    }
};
