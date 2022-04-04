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
        name: 'fineTicket',
        type: 'decimal',
        nullable: true,
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
    })
    description: string | undefined;

    @Column({
        name: 'anticipation',
        type: 'boolean',
    })
    anticipation: Boolean | undefined;

    @Column({
        name: 'referenceDate',
        type: 'timestamp',
    })
    referenceDate: Date | undefined;

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
        nullable: true
    })
    returnMessage: string | undefined;

    @Column({
        name: 'paymentId',
        type: 'varchar',
        nullable: true
    })
    paymentId: string | undefined;

    @Column({
        name: 'tid',
        type: 'varchar',
        nullable: true
    })
    tid: string | undefined;

    @Column({
        name: 'returnCode',
        type: 'varchar',
        nullable: true
    })
    returnCode: string | undefined;

    @ManyToOne(() => PreRegisterResidentEntity, preUser => preUser.id)
    @JoinColumn({ name: 'residentIdenty' })
    residentIdenty: number | undefined;

}
