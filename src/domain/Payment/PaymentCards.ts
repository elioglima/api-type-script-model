import { EnumBrands } from '../../enum/';
export interface PaymentCards {
    id?: number;
    userId?: number;
    token?: string;
    cardNumber: string;
    lastFourNumbers?: string;
    firstFourNumbers?: string;
    brand: EnumBrands;
    customerName: string;
    expirationDate: string;
    enterpriseId?: number;
    holder: string;
    hash: string;
    hashC?: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
