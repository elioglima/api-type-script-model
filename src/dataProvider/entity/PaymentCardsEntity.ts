import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('paymentCards')
export class PaymentCardsEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'active',
        type: 'boolean',
        default: true,
    })
    active: Boolean | undefined;

    @Column({
        // cardtoken
        name: 'token',
        type: 'varchar',
        length: 200,
    })
    token: string | undefined;

    @Column({
        name: 'userId',
        type: 'int',
        nullable: true,
    })
    userId: number | undefined;

    @Column({
        name: 'residentId',
        type: 'int',
        nullable: true,
    })
    residentId: number | undefined;

    @Column({
        name: 'enterpriseId',
        type: 'int',
    })
    enterpriseId: number | undefined;

    @Column({
        name: 'firstFourNumbers',
        type: 'varchar',
        length: 10,
    })
    firstFourNumbers: string | undefined;

    @Column({
        name: 'lastFourNumbers',
        type: 'varchar',
        length: 10,
    })
    lastFourNumbers: string | undefined;

    @Column({
        name: 'brand',
        type: 'varchar',
        length: 30,
    })
    brand: string | undefined;

    @Column({
        name: 'hash',
        type: 'varchar',
        length: 200,
    })
    hash: string | undefined;

    @Column({
        name: 'hashC',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    hashC: string | undefined; // numcard crip

    @Column({
        name: 'holder',
        type: 'varchar',
        length: 200,
    })
    holder: string | undefined;

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
