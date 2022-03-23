import { EnumBrands } from '../../enum/BrandsEnum';


export type TFirstPaymentExecReq = {
    hash: string,
    card: {
        cardNumber: string,
        brand: EnumBrands,
        customerName: string,
        expirationDate: string,
        holder: string,
    }
}


