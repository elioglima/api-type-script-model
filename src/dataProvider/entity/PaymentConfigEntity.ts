import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('paymentConfig')
export class PaymentConfigEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'enterpriseId',
        type: 'int',
    })
    enterpriseId: number | undefined;

    @Column({
        name: 'merchantId',
        type: 'varchar',
        length: 100,
    })
    merchantId: string | undefined;

    @Column({
        name: 'merchantKey',
        type: 'varchar',
        length: 100,
    })
    merchantKey: string | undefined;

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
