import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TMethodPayment } from 'src/domain/Tegrus';
import { PaymentStatus } from '../../enum/PaymentStatusEnum';

@Entity('invoice')
export class InvoiceEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'invoice_id',
        type: 'int',
    })
    invoice_id: number | undefined;

    @Column({
        name: 'apartment_id',
        type: 'int',        
    })
    apartment_id: number | undefined;

    @Column({
        name: 'resident_id',
        type: 'int',
    })
    resident_id: number | undefined;


    @Column({
        name: 'enterprise_id',
        type: 'int',
    })
    enterprise_id: number | undefined;

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
    reference_date: Date | undefined;

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
        name: 'first_payment',
        type: 'boolean',
    })
    first_payment: Boolean | undefined;

    @Column({
        name: 'payment_method',
        type: 'enum',
        enum: TMethodPayment
    })
    payment_method: TMethodPayment | undefined;


    @Column({
        name: 'status_invoice',
        type: 'enum',
        enum: TMethodPayment
    })
    status_invoice: string | undefined;



}
