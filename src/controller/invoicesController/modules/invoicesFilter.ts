import { Request, Response } from 'express';
import InvoiceService from '../../../service/invoiceService';
import { TInvoiceFilter } from '../../../domain/Tegrus/TInvoice';


export const invoicesFilter = async (req: Request, res: Response) => {
    try {
        
        const invoicesFilter: TInvoiceFilter = req?.body;

        const invoiceService = new InvoiceService();
        const response = await invoiceService.Find(invoicesFilter);
        if (response.err) {
            return res.status(422).json(response);
        }        
        const result = response.data.map((m: any) => ({
            id: m.id,
            date: m.date,
            invoiceId: m.invoiceId,
            apartmentId: m.apartmentId,
            description: m.description,
            enterpriseId: m.enterpriseId,
            paymentMethod: m.paymentMethod,
            statusInvoice: m.statusInvoice,
            type: m.type,
            value: m.value,
            condominium: m.condominium,
            discount: m.discount,
            refund: m.refund,
            tax: m.tax,
            fine: m.fine,
            fineTickets: m.fineTickets,
            resident: m.residentIdenty,
        }));

        return res.status(200).json({
            err: false,
            data: result,
        });
    } catch (error) {
        console.log(error);
        return res.status(422).json(error);
    }
};
