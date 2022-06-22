import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nomeTabela')
export class ModelEntity {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: Number | undefined;

    @Column({
        name: 'field1',
        type: 'varchar',
    })
    field1: string | undefined;

    @Column({
        name: 'field2',
        type: 'int',
    })
    field2: number | undefined;

    @Column({
        name: 'field3',
        type: 'varchar',
        nullable: true,
    })
    field3: string | undefined;
}
