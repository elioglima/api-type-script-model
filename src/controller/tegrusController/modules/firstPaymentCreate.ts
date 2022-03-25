import debug from 'debug';
import { resFirstPaymentCreate } from './../../../domain/Tegrus/TFirstPayment';
import { Request, Response } from 'express';
import { TErrorGeneric } from '../../../domain/Generics';
import { TFirstPayment } from '../../../domain/Tegrus';
import tegrusServices from '../../../service/tegrus.services';

/*
 * criar uma tabela para pre cadastro usuarios - preRegisterResident
 * criar uma tabela para faturas usuario nao logado - invoices
 * criar uma tabela para armazenamento do token
 * gerar um link para o cliente acessar a tela de paramento
 * criar recibos de faturas pagas comprovantes - receipts
 */

type TFirstPaymentReq = {
    createResident: TFirstPayment;
};

const firstPaymentCreate = async (req: Request, res: Response) => {
    const logger = debug('payment-api:PaymentController');   

    try {
        const body: TFirstPaymentReq = req?.body;        
        const data: resFirstPaymentCreate | TErrorGeneric =
            await tegrusServices.firstPaymentCreateService(body);

        if (data instanceof Error) {
            logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    } catch (error: any) {
        console.log(error);
        return res.status(422).json(error);
    }
};

export { firstPaymentCreate };
