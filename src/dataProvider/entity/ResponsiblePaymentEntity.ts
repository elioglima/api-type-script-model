import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TDOC } from '../../domain/Tegrus';

@Entity('responsiblePayment')
export class ResponsiblePaymentEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number | undefined;

    @Column({
        name: 'active',
        type: 'boolean',
        default: true,
    })
    active: Boolean | undefined;

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
        name: 'name',
        type: 'varchar',
    })
    name: string | undefined;

    @Column({
        name: 'mail',
        type: 'varchar',
    })
    mail: string | undefined;

    @Column({
        name: 'documentType',
        type: 'enum',
        enum: TDOC,
    })
    documentType: string | undefined;

    @Column({
        name: 'document',
        type: 'varchar',
    })
    document: string | undefined;
}
