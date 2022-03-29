import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
} from 'typeorm';
import { TDOC } from '../../domain/Tegrus';
import { InvoiceEntity } from './InvoiceEntity';

@Entity('preRegisterResident')
export class PreRegisterResidentEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: Number | undefined;

    @Column({
        name: 'name',
        type: 'varchar',
    })
    name: string | undefined;

    @Column({
        name: 'nationality',
        type: 'varchar',
    })
    nationality: string | undefined;

    @Column({
        name: 'nickname',
        type: 'varchar',
    })
    nickname: string | undefined;

    @Column({
        name: 'email',
        type: 'varchar',
    })
    email: string | undefined;

    @Column({
        name: 'birthDate',
        type: 'timestamp',
    })
    birthDate: Date | undefined;

    @Column({
        name: 'smartphone',
        type: 'varchar',
    })
    smartphone: string | undefined;

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

    @Column({
        name: 'description',
        type: 'varchar',
    })
    description: string | undefined;

    @Column({
        name: 'externalId',
        type: 'int',
    })
    externalId: Number | undefined;

    @Column({
        name: 'apartmentId',
        type: 'int',
    })
    apartmentId: Number | undefined;

    @Column({
        name: 'enterpriseId',
        type: 'int',
    })
    enterpriseId: Number | undefined;

    @Column({
        name: 'contractCode',
        type: 'varchar',
    })
    contractCode: string | undefined;

    @Column({
        name: 'startDateContract',
        type: 'timestamp',
    })
    startDateContract: Date | undefined;

    @Column({
        name: 'endDateContract',
        type: 'timestamp',
    })
    endDateContract: Date | undefined;

    @OneToMany(() => InvoiceEntity, invoice => invoice.id)
    @JoinColumn({ name: 'invoice' })
    invoice: InvoiceEntity[] | undefined;

    @Column({
        name: 'cardHolder',
        type: 'varchar',
        length: 70,
    })
    holder: string | undefined;

    @Column({
        name: 'cardFirstFourNumbers',
        type: 'varchar',
        length: 10,
    })
    firstFourNumbers: string | undefined;

    @Column({
        name: 'cardFourNumbers',
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
        name: 'cardToken',
        type: 'varchar',
        length: 200,
    })
    @Column({
        name: 'cardHash',
        type: 'varchar',
        length: 200,
    })
    hash: string | undefined;
}
