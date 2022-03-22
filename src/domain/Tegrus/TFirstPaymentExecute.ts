import { EnumBrands } from '../../enum/BrandsEnum';


export type TFirstPaymentExecReq = {
    invoice: {
        invoiceId: number,
        apartmentId: number,
        residentId: number,
        enterpriseId: number,
    },
    card: {
        cardNumber: string,
        brand: EnumBrands,
        customerName: string,
        expirationDate: string,
        holder: string,
    }
}


