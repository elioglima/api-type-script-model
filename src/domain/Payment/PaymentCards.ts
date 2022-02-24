import { EnumBrands } from '../../enum/';
export interface PaymentCards {
    id: number;
    userId: number;
    token: string;
    cardNumber: string;
    lastFourNumbers: string;
    brand: EnumBrands;
    customerName: string;
    expirationDate: string;
    enterpriseId: number;
    holder: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
