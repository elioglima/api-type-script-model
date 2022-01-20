import { PaymentStatus } from 'src/enum/PaymentStatusEnum';

export interface Payment {
    id: number;
    userId: number;
    transactionId: string;
    transactionMessage: string;
    value: number;
    status: PaymentStatus;
    descriptionMessage: string;
    descriptionIdReference: string;
    createdAt: Date;
    updatedAt: Date;
}
