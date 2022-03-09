import { TResident } from './../../../domain/Tegrus/TResident';
import { Request, Response } from 'express';
import { TErrorGeneric } from '../../../domain/Generics'
import { TFirstPayment } from '../../../domain/Tegrus'

/*
            
    * criar uma tabela para pre cadastro usuarios - preRegisterResident
    * criar uma tabela para faturas usuario nao logado - invoices    
    * criar uma tabela para armazenamento do token
    * gerar um link para o cliente acessar a tela de paramento
    * criar recibos de faturas pagas comprovantes - receipts

*/


type resFirstPaymentCreate = {
    err: Boolean,
    

}

const firstPaymentCreate = (req: Request, res: Response): (resFirstPaymentCreate | TErrorGeneric) => {
    try {
        const body: TFirstPayment = req?.body;

        /* 
            
            1 - criar uma tabela para pre cadastro usuarios - preRegisterResident
            2 - criar uma tabela para faturas usuario nao logado - invoices    
            3 - criar recibos de faturas pagas comprovantes - receipts
            
            3 - createHash - gerar hash - criar date para tempo de validade
            4 - criar uma tabela para armazenamento do token

            5 - enviar o link para o cliente SMS e EMAIL
                        
        */

        const { resident } = body;





        return res.status(200).json(body);
    } catch (error: any) {
        return res.status(422).json(error);
    }

}

export { firstPaymentCreate }