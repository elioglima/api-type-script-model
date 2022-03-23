import HashSearchService from './hashSearchService';
import { TFirstPaymentExecReq } from '../../domain/Tegrus';
import Payment from 'src/domain/Adapter';
import { reqRecurrentCreate } from 'src/domain/RecurrentPayment';

export default async (
    payload: TFirstPaymentExecReq,
) => {        
    const hashServices = new HashSearchService();
    const paymentAdapter = new Payment();
    
    const { hash } = payload;
    const resHash: any= await hashServices.execute(hash);

    if(resHash?.err) return resHash
        
    const makeRecurrent : reqRecurrentCreate = {
        merchantOrderId: "20141231231",
        customer: {
            name: resHash?.resident?.name     
        },
        payment:{
            type: "CreditCard",
            amount: resHash?.invoice?.amount,
            installments: 1,
            softDescriptor: "Recorrencia JFL",
            recurrentPayment: {
                authorizeNow: false,
                endDate: resHash?.invoice?.endReferenceDate,
                interval: "Monthly"
            },
            creditCard: {
                cardNumber: payload?.card?.cardNumber,
                holder: payload?.card?.holder,
                expirationDate: payload?.card?.expirationDate,
                customerName: payload?.card?.customerName,
                brand: payload?.card?.brand               
            }
        }
    } 
    return await paymentAdapter.recurrentCreate(makeRecurrent)   
};
