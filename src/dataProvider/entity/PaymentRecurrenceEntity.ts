import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentCardsEntity } from './PaymentCardsEntity';

@Entity('paymentRecurrence')
export class PaymentRecurrenceEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'userId',
        type: 'int',
    })
    userId: number | undefined;

    @Column({
        name: 'recurrenceId',
        type: 'varchar',
        length: 50,
    })
    recurrenceId: string | undefined;

    @ManyToOne(() => PaymentCardsEntity, paymentCard => paymentCard, {
        eager: true,
    })
    paymentCard: PaymentCardsEntity | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number | undefined;

    @Column({
        name: 'createdAt',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    createdAt: Date | undefined;

    @Column({
        name: 'updatedAt',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()',
        onUpdate: 'CURRENT_TIMESTAMP()',
    })
    updatedAt: Date | undefined;

    @Column({ name: 'deletedAt', type: 'timestamp', nullable: true })
    deletedAt: Date | undefined;
}
