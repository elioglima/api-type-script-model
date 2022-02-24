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
        name: 'provider',
        type: 'varchar',
        length: 50,
    })
    provider: string | undefined;

    @Column({
        name: 'hostnameTransacao',
        type: 'varchar',
        length: 100,
    })
    hostnameTransacao: string | undefined;

    @Column({
        name: 'hostnameQuery',
        type: 'varchar',
        length: 100,
    })
    hostnameQuery: string | undefined;

    @Column({
        name: 'merchantId',
        type: 'varchar',
        length: 200,
    })
    merchantId: string | undefined;

    @Column({
        name: 'merchantKey',
        type: 'varchar',
        length: 200,
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
