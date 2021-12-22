import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentType } from '../../enum/PaymentTypeEnum';
import { PaymentStatus } from '../../enum/PaymentStatusEnum';

@Entity('payment')
export class PaymentEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'gatewayId',
        type: 'varchar',
        length: 50,
    })
    gatewayId: string | undefined;

    @Column({
        name: 'type',
        type: 'enum',
        enum: PaymentType,
        nullable: true,
    })
    type: string | undefined;

    @Column({
        name: 'status',
        type: 'enum',
        enum: PaymentStatus,
        nullable: true,
    })
    status: string | undefined;

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

    @Column({
        name: 'deletedAt',
        type: 'timestamp',
        nullable: true,
    })
    deletedAt: Date | undefined;
}
