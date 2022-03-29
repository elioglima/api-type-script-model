import { Request, Response } from 'express';
import { TFirstPaymentExecReq } from '../../../domain/Tegrus';
import recurrentPaymentService from '../../../service/tegrus.services/recurrentPaymentService';

const paymentRecurrentExecute = async (req: Request, res: Response) => {
    try {
        const body: TFirstPaymentExecReq = req?.body;
        const resRecurrecy = await recurrentPaymentService(body);

        if (resRecurrecy?.err)
            return res.status(404).json({
                status: 404,
                resRecurrecy,
            });

        return res.status(200).json({
            status: 200,
            statusInvoice: resRecurrecy,
        });
    } catch (error: any) {
        console.log('ERROR', error);
        return res.status(422).json(error);
    }
};

export { paymentRecurrentExecute };
