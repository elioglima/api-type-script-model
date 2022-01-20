export interface PaymentCards {
    id: number;
    userId: number;
    token: string;
    lastFourNumbers: string;
    brand: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
