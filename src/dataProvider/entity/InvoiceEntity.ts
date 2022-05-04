import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { PreRegisterResidentEntity } from './PreRegisterResidentEntity';

import { EnumInvoicePaymentMethod } from '../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceStatus } from '../../domain/Tegrus/EnumInvoiceStatus';
import { EnumInvoiceType } from '../../domain/Tegrus/EnumInvoiceType';

@Entity('invoice')
export class InvoiceEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'active',
        type: 'boolean',
        default: true,
    })
    active: Boolean | undefined;

    @Column({
        name: 'date',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    date: Date | undefined;

    @Column({
        name: 'invoiceId',
        type: 'int',
    })
    invoiceId: number | undefined;

    @Column({
        name: 'userId',
        type: 'int',
        nullable: true,
    })
    userId: number | undefined;

    @Column({
        name: 'apartmentId',
        type: 'int',
    })
    apartmentId: number | undefined;

    @Column({
        name: 'enterpriseId',
        type: 'int',
    })
    enterpriseId: number | undefined;

    @Column({
        name: 'value',
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    value: number | undefined;

    @Column({
        name: 'totalValue',
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    totalValue: number | undefined;

    @Column({
        name: 'condominium',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    condominium: number | undefined;

    @Column({
        name: 'stepValue',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    stepValue: number | undefined;

    @Column({
        name: 'commission',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    commission: number | undefined;

    @Column({
        name: 'discount',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    discount: number | undefined;

    @Column({
        name: 'tax',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    tax: number | undefined;

    @Column({
        name: 'refund',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    refund: number | undefined;

    @Column({
        name: 'expense',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    expense: number | undefined;

    @Column({
        name: 'fine',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    fine: number | undefined;

    @Column({
        name: 'fineTicket',
        type: 'decimal',
        nullable: true,
        precision: 10,
        scale: 2,
    })
    fineTicket: number | undefined;

    @Column({
        name: 'dueDate',
        type: 'timestamp',
    })
    dueDate: Date | undefined;

    @Column({
        name: 'description',
        type: 'varchar',
        nullable: true,
    })
    description: string | undefined;

    @Column({
        name: 'comments',
        type: 'varchar',
        nullable: true,        
    })
    comments: string | undefined;

    @Column({
        name: 'anticipation',
        type: 'boolean',
        default: false,
    })
    anticipation: Boolean | undefined;

    @Column({
        name: 'isExpired',
        type: 'boolean',
        default: false,
    })
    isExpired: Boolean | undefined;

    @Column({
        name: 'isRefunded',
        type: 'boolean',
        default: false,
        nullable: true,
    })
    isRefunded: Boolean | undefined;

    @Column({
        name: 'atUpdate',
        type: 'boolean',
        default: false,
    })
    atUpdate: Boolean | undefined;

    @Column({
        name: 'referenceDate',
        type: 'timestamp',
        nullable: true,
    })
    referenceDate: Date | undefined;

    @Column({
        name: 'firstPayment',
        type: 'boolean',
        nullable: true,
    })
    firstPayment: Boolean | undefined;

    @Column({
        name: 'recurenceNumber',
        type: 'int',
        nullable: true,
    })
    recurenceNumber: Number | undefined;

    @Column({
        name: 'recurenceTotalNumber',
        type: 'int',
        nullable: true,
    })
    recurenceTotalNumber: Number | undefined;

    @Column({
        name: 'recurrenceDate',
        type: 'timestamp',
        nullable: true,
    })
    recurrenceDate: Date | undefined;

    @Column({
        name: 'startReferenceDate',
        type: 'timestamp',
        nullable: true,
    })
    startReferenceDate: Date | undefined;

    @Column({
        name: 'endReferenceDate',
        type: 'timestamp',
        nullable: true,
    })
    endReferenceDate: Date | undefined;

    @Column({
        name: 'type',
        type: 'enum',
        enum: EnumInvoiceType,
    })
    type: EnumInvoiceType | undefined;

    @Column({
        name: 'paymentMethod',
        type: 'enum',
        enum: EnumInvoicePaymentMethod,
    })
    paymentMethod: EnumInvoicePaymentMethod | undefined;

    @Column({
        name: 'statusInvoice',
        type: 'enum',
        enum: EnumInvoiceStatus,
    })
    statusInvoice: EnumInvoiceStatus | undefined;

    @Column({
        name: 'paymentDate',
        type: 'timestamp',
        nullable: true,
    })
    paymentDate: Date | undefined;

    @Column({
        name: 'isRecurrence',
        type: 'boolean',
        default: false,
    })
    isRecurrence: Boolean | undefined;

    @Column({
        name: 'returnMessage',
        type: 'varchar',
        nullable: true,
    })
    returnMessage: string | undefined;

    @Column({
        name: 'paymentId',
        type: 'varchar',
        nullable: true,
    })
    paymentId: string | undefined;

    @Column({
        name: 'tid',
        type: 'varchar',
        nullable: true,
    })
    tid: string | undefined;

    @Column({
        name: 'returnCode',
        type: 'varchar',
        nullable: true,
    })
    returnCode: string | undefined;

    @Column({
        name: 'referenceCode',
        type: 'int',
        nullable: true,
    })
    referenceCode: number | undefined;

    @Column({
        name: 'tryNumber',
        type: 'int',
        default: 0,
    })
    tryNumber: number | undefined;

    @ManyToOne(() => PreRegisterResidentEntity, preUser => preUser.id)
    @JoinColumn({ name: 'residentIdenty' })
    residentIdenty: number | undefined;
}
