import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentStatus } from '../../enum/PaymentStatusEnum';

@Entity('payment')
export class PaymentEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'userId',
        type: 'int',
    })
    userId: number | undefined;

    @Column({
        name: 'transactionId',
        type: 'varchar',
        length: 50,
    })
    transactionId: string | undefined;

    @Column({
        name: 'transactionMessage',
        type: 'varchar',
        length: 50,
    })
    transactionMessage: string | undefined;


    @Column({
        name: 'transactionCode',
        type: 'int',
    })
    transactionCode: number | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number | undefined;

    @Column({
        name: 'status',
        type: 'enum',
        enum: PaymentStatus,
        nullable: true,
    })
    status: string | undefined;

    @Column({
        name: 'descriptionMessage',
        type: 'varchar',
        length: 200,
    })
    descriptionMessage: string | undefined;

    // @Column({
    //     name: 'descriptionIdReference',
    //     type: 'varchar',
    //     length: 200,
    // })
    // descriptionIdReference: string | undefined;

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

}
