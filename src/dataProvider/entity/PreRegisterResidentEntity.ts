import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TDOC } from 'src/domain/Tegrus';

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
}
