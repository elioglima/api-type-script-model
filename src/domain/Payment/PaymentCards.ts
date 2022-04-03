import { EnumBrands } from '../../enum/';
export interface PaymentCards {
    id?: number;
    enterpriseId?: number;
    userId?: number;
    residentId?: number;
    token?: string;
    cardNumber: string;
    lastFourNumbers?: string;
    firstFourNumbers?: string;
    brand: EnumBrands;
    customerName: string;
    expirationDate: string;
    holder: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    hash?: string; // codigo de seguranca
    securityCode?: number; // codigo de seguranca
    hashC?: string;
}

export type TFindExistsFilter = {
    userId?: number;
    residentId?: number;
    enterpriseId?: number;
    firstFourNumbers?: string;
    lastFourNumbers?: string;
    brand?: string;
};
