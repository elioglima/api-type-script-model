import { Request, Response } from 'express';
import InvoiceService from '../../service/InvoiceService';

export const getInvoices = async (req: Request, res: Response) => {
    try {
        console.log(req?.body);
        const invoiceService = new InvoiceService();

        // aplicar filtro
        // invoiceId, residentId, idUser, data, statusInvoice, paymentMethod, statusInvoice
        // o filtro deve respeitar as que tenham active = true
        // integrar com os bff web e mobile

        // {
        //     err: false,
        //     data: [
        //         {
        //             id,
        //             date,
        //             invoiceId,
        //             residentId,
        //             idUser,
        //             description,
        //             paymentMethod: {
        //                 ticket = 'ticket',
        //                 transfer = 'transfer',
        //                 credit = 'credit',
        //                 internationalTransfer = 'international_transfer',
        //                 courtesy = 'courtesy',
        //             },
        //             statusInvoice: {
        //                 canceled = 'canceled',
        //                 issued = 'issued',
        //                 credit = 'credit',
        //                 reject = 'reject',
        //                 pay = 'pay',
        //                 paused = 'paused',
        //             },
        //             value
        //         }
        //     ]
        //  }

        const response = await invoiceService.getAll();
        if (response instanceof Error) {
            return res.status(422).json(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(422).json(error);
    }
};
