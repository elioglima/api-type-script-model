import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TMethodPayment } from 'src/domain/Tegrus';
import { TStatusInvoice } from 'src/domain/Tegrus';

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
        name: 'reference_date',
        type: 'timestamp',
    })
    referenceDate: Date | undefined;

    @Column({
        name: 'due_date',
        type: 'timestamp',
    })
    due_date: Date | undefined;

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
        enum: TMethodPayment
    })
    paymentMethod: TMethodPayment | undefined;


    @Column({
        name: 'statusInvoice',
        type: 'enum',
        enum: TStatusInvoice
    })
    statusInvoice: string | undefined;



}
