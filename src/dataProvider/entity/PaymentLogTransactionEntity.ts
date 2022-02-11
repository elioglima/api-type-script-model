import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('paymentLogTransaction')
export class PaymentLogTransactionEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'request',
        type: 'longtext',
    })
    request: string | undefined;

    @Column({
        name: 'response',
        type: 'longtext',
    })
    response: string | undefined;

    @Column({
        name: 'createdAt',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    createdAt: Date | undefined;
}
