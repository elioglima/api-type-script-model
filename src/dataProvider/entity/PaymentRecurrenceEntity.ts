import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('paymentRecurrence')
export class PaymentRecurrenceEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    // @Column({
    //     name: 'recurrenceId',
    //     type: 'int',
    // })
    // recurrenceId: number | undefined;

    @Column({
        name: 'residentId',
        type: 'int',
    })
    residentId: number | undefined;

    @Column({ name: 'value', type: 'decimal', precision: 10, scale: 2 })
    value: number | undefined;

    @Column({ name: 'active', type: 'boolean', default: 1 })
    active: boolean | undefined;

    @Column({ name: 'isDeactivateError', type: 'boolean', default: 0 })
    isDeactivateError: boolean | undefined;

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

    @Column({
        name: 'payCardNumber',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    payCardNumber: string | undefined;

    @Column({
        name: 'payCardHolder',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    payCardHolder: string | undefined;

    @Column({
        name: 'payCardExpirationDate',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    payCardExpirationDate: string | undefined;

    @Column({ name: 'payCardSaveCard', type: 'boolean', default: true })
    payCardSaveCard: boolean | undefined;

    @Column({
        name: 'payCardBrand',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    payCardBrand: string | undefined;

    @Column({
        name: 'recurrentPaymentId',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    recurrentPaymentId: string | undefined;

    @Column({
        name: 'reasonCode',
        type: 'int',
        nullable: true,
    })
    reasonCode: number | undefined;

    @Column({
        name: 'reasonMessage',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    reasonMessage: string | undefined;

    @Column({
        name: 'nextRecurrency',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    nextRecurrency: Date | undefined;

    @Column({
        name: 'interval',
        type: 'int',
        nullable: true,
    })
    interval: number | undefined;

    @Column({
        name: 'linkRecurrentPayment',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    linkRecurrentPayment: string | undefined;

    @Column({ name: 'authorizeNow', type: 'boolean', default: false })
    authorizeNow: boolean | undefined;
}
