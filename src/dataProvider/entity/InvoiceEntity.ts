import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { PreRegisterResidentEntity } from './PreRegisterResidentEntity';

import {
    EnumInvoicePaymentMethod,
    EnumTopicStatusInvoice,
} from '../../domain/Tegrus';

@Entity('invoice')
export class InvoiceEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'invoiceId',
        type: 'int',
    })
    invoiceId: number | undefined;

    @Column({
        name: 'idUser',
        type: 'int',
        nullable: true,
    })
    idUser: number | undefined;

    @ManyToOne(() => PreRegisterResidentEntity, preUser => preUser.id)
    @JoinColumn({ name: 'resident' })
    resident: number | undefined;

    @Column({
        name: 'apartmentId',
        type: 'int',
    })
    apartmentId: number | undefined;

    @Column({
        name: 'residentId',
        type: 'int',
    })
    residentId: number | undefined;

    @Column({
        name: 'enterpriseId',
        type: 'int',
    })
    enterpriseId: number | undefined;

    @Column({
        name: 'value',
        type: 'decimal',
    })
    value: number | undefined;

    @Column({
        name: 'condominium',
        type: 'decimal',
    })
    condominium: number | undefined;

    @Column({
        name: 'discount',
        type: 'decimal',
    })
    discount: number | undefined;

    @Column({
        name: 'tax',
        type: 'decimal',
    })
    tax: number | undefined;

    @Column({
        name: 'refund',
        type: 'decimal',
    })
    refund: number | undefined;

    @Column({
        name: 'fine',
        type: 'decimal',
    })
    fine: number | undefined;

    @Column({
        name: 'referenceDate',
        type: 'timestamp',
    })
    referenceDate: Date | undefined;

    @Column({
        name: 'startDateRecurrence',
        type: 'timestamp',
    })
    startDateRecurrence: Date | undefined;

    @Column({
        name: 'dueDate',
        type: 'timestamp',
    })
    dueDate: Date | undefined;

    @Column({
        name: 'description',
        type: 'varchar',
    })
    description: string | undefined;

    @Column({
        name: 'anticipation',
        type: 'boolean',
    })
    anticipation: Boolean | undefined;

    @Column({
        name: 'firstPayment',
        type: 'boolean',
    })
    firstPayment: Boolean | undefined;

    @Column({
        name: 'paymentMethod',
        type: 'enum',
        enum: EnumInvoicePaymentMethod,
    })
    paymentMethod: EnumInvoicePaymentMethod | undefined;

    @Column({
        name: 'statusInvoice',
        type: 'enum',
        enum: EnumTopicStatusInvoice,
    })
    statusInvoice: EnumTopicStatusInvoice | undefined;

    @Column({
        name: 'startReferenceDate',
        type: 'timestamp',
    })
    startReferenceDate: Date | undefined;

    @Column({
        name: 'endReferenceDate',
        type: 'timestamp',
    })
    endReferenceDate: Date | undefined;

    @Column({
        name: 'recurrenceId',
        type: 'varchar',
        nullable: true,
    })
    recurrenceId: string | undefined;

    @Column({
        name: 'date',
        type: 'timestamp',
        nullable: true,
    })
    date: string | undefined;

    @Column({
        name: 'active',
        type: 'boolean',
        default: true,
    })
    active: Boolean | undefined;
}
