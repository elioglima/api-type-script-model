import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { InvoiceEntity } from './InvoiceEntity';
import { PreRegisterResidentEntity } from './PreRegisterResidentEntity';


@Entity('hashData')
export class HashDataEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: Number | undefined;

    @Column({
        name: 'hash',
        type: 'varchar',
    })
    hash: string | undefined;

    @Column({
        name: 'link',
        type: 'varchar',
    })
    link: string | undefined;

    @Column({
        name: 'lifeTime',
        type: 'timestamp',
    })
    lifeTime: Date | undefined;

    @OneToOne(() => InvoiceEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
    @JoinColumn()
    InvoiceEntity: InvoiceEntity | undefined;

    @OneToOne(() => PreRegisterResidentEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: false })
    @JoinColumn()
    PreRegisterResidentEntity: PreRegisterResidentEntity | undefined;

    @Column({
        name: 'valid',
        type: 'boolean',
        default: 1,
    })
    valid: Boolean | undefined;

}
