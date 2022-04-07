import { EnumBrands } from '../../enum/BrandsEnum';

export type TPayNowReq = {
    hash: string;
    invoiceId: number;
    cardId: number;
    card: {
        cardNumber: string;
        brand: EnumBrands;
        customerName: string;
        expirationDate: string;
        holder: string;
        securityCode: number;
    };
};
