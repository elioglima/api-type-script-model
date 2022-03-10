import { TErrorGeneric, PromiseExec } from '../../domain/Generics'
import { resFirstPaymentCreate } from '../../domain/Tegrus/TFirstPayment';
import { TFirstPayment, reqSendLinkResident } from '../../domain/Tegrus'
import { reqCreateHash, resCreateHash } from '../../domain/Tegrus/TFirstPayment'
// import sendLinkResident from './sendLinkResident'
// import createHash from './createHash'

// import { PaymentRepository } from '../dataProvider/repository/PaymentRepository';

export default (payload: TFirstPayment): Promise<TErrorGeneric | resFirstPaymentCreate> => {

    /* 
       
       1 - criar uma tabela para pre cadastro usuarios - preRegisterResident
       2 - criar uma tabela para faturas usuario nao logado - invoices    
       3 - criar recibos de faturas pagas comprovantes - receipts
       
       3 - createHash - gerar hash - criar date para tempo de validade
       4 - criar uma tabela para armazenamento do token

       5 - enviar o link para o cliente SMS e EMAIL
                   
   */

    const dataHash: reqCreateHash = {
        invoiceId: 123,
        // url?: any
    }

    // const resultHash: TErrorGeneric | resCreateHash = createHash(dataHash)

    // if (resultHash?.err) {
    //     return PromiseExec(resultHash)
    // }

    // const dataSendLinkResident: reqSendLinkResident = resultHash
    // const resultSendLinkResident = sendLinkResident(dataSendLinkResident)
    return PromiseExec({
        err: true,
        data: {
            payload
        }
    })
}
