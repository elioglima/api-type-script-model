import { Request, Response } from 'express';
import InvoiceService from 'src/service/InvoiceService';
import { TInvoiceFilter } from 'src/domain/Tegrus';

export const getInvoices = async (req: Request, res: Response) => {
    try {
        const { dateStart, dateEnd, residentId, idUser, invoiceId, paymentMethod, statusInvoice }: any = req?.query;

        // if (dateStart && dateEnd && (residentId || idUser))
        //     return {
        //         err: true,
        //         data: {
        //             message:
        //                 'Please inform the filters(dateStart, dateEnd, residentId or idUser))',
        //         },
        //     };

        const invoicesFilter:TInvoiceFilter = {
            // dateStart,
            // dateEnd,
            ...residentId ? {residentId: residentId} : {},
            ...idUser ? {idUser: idUser} : {},
            ...invoiceId ? {invoiceId: invoiceId} : {},
            ...paymentMethod ? {paymentMethod: paymentMethod} : {},
            ...statusInvoice ? {statusInvoice: statusInvoice} : {}            
        }
        
        console.log("invoicesFilter", invoicesFilter)


        const invoiceService = new InvoiceService();
        const response: any = await invoiceService.Find(invoicesFilter);
        
        console.log("RESP", response)

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
