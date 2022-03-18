import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TDOC } from 'src/domain/Tegrus';

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
    invoiceId: Number | undefined;


    @Column({
        name: 'link',
        type: 'varchar',
    })
    link: string | undefined;


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
        name: 'lifeTime',
        type: 'timestamp',
    })
    lifeTime: Date | undefined;

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


}
