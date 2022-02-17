import { PaymentCardsEntity } from '../../dataProvider/entity/PaymentCardsEntity';

export interface PaymentRecurrence {
    id: number;
    userId: number;
    recurrenceId: string;
    paymentCard: PaymentCardsEntity;
    value: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
