import { TErrorGeneric, PromiseExec } from '../../domain/Generics'
import { resFirstPaymentCreate } from '../../domain/Tegrus/TFirstPayment';
import { TFirstPayment } from '../../domain/Tegrus'

// import createHash from './createHash'
// import { reqCreateHash, resCreateHash } from '../../domain/Tegrus/TFirstPayment'
// import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export default (payload: TFirstPayment): Promise<resFirstPaymentCreate | TErrorGeneric> => {

    /* 
       
       1 - criar uma tabela para pre cadastro usuarios - preRegisterResident
       2 - criar uma tabela para faturas usuario nao logado - invoices    
       3 - criar recibos de faturas pagas comprovantes - receipts
       
       3 - createHash - gerar hash - criar date para tempo de validade
       4 - criar uma tabela para armazenamento do token

       5 - enviar o link para o cliente SMS e EMAIL
                   
   */

    // const dataHash: reqCreateHash = {
    //     invoiceId: number,
    //     url?: any
    // }
    // const resultHash: resCreateHash | TErrorGeneric = createHash(dataHash)

    return PromiseExec({
        err: true,
        data: {
            payload
        }
    })
}
