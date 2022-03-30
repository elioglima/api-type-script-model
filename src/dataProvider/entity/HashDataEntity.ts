import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
        name: 'invoiceId',
        type: 'int',
    })
    invoiceId: number | undefined;

    @Column({
        name: 'link',
        type: 'varchar',
        nullable: true,
    })
    link: string | undefined;

    @Column({
        name: 'lifeTime',
        type: 'timestamp',
    })
    lifeTime: Date | undefined;

    @Column({
        name: 'valid',
        type: 'boolean',
        default: 1,
    })
    valid: Boolean | undefined;
}
