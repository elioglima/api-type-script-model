import { Request, Response } from 'express';
import { TErrorGeneric } from '../../../domain/Generics'
import { TFirstPayment } from '../../../domain/Tegrus'

/*
            
    * criar uma tabela para armazenamento do token
    * gerar um link para o cliente acessar a tela de paramento
    * criar uma tabela para pre cadastro
    * criar uma tabela para faturas
    * criar recibos de faturas pagas

*/


type resFirstPaymentCreate = {

}

const firstPaymentCreate = (req: Request, res: Response): (resFirstPaymentCreate | TErrorGeneric) => {
    try {
        const body: TFirstPayment = req?.body;
        return res.status(200).json(body);
    } catch (error: any) {
        return res.status(422).json(error);
    }

}

export { firstPaymentCreate }