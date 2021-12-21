import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceEnterpriseEntity } from './ServiceEnterpriseEntity';

@Entity('payment')
class ServiceEntity {
    @PrimaryGeneratedColumn({ name: 'idPayment', type: 'int' })
    idPayment: number | undefined;

    @Column({ name: 'externalId', type: 'varchar' })
    title: string | undefined;

    @Column({ name: 'title_en', type: 'varchar', length: 120, nullable: true })
    titleEN: string | undefined;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string | undefined;

    @Column({ name: 'description_en', type: 'text', nullable: true })
    descriptionEN: string | undefined;

    @Column({ name: 'condicoes', type: 'text', nullable: true })
    condicoes: string | undefined;

    @Column({ name: 'condicoes_en', type: 'text', nullable: true })
    condicoesEN: string | undefined;

    @Column({
        name: 'localization',
        type: 'varchar',
        length: 120,
        nullable: true,
    })
    localization: string | undefined;

    @Column({
        name: 'localization_en',
        type: 'varchar',
        length: 120,
        nullable: true,
    })
    localizationEN: string | undefined;

    @Column({ name: 'hasSchedule', type: 'boolean' })
    hasSchedule: boolean | undefined;

    @Column({ name: 'hasCredit', type: 'boolean', default: false })
    hasCredit: boolean | undefined;

    @Column({ name: 'idSchedule', type: 'varchar', length: 45, nullable: true })
    idSchedule: string | undefined;

    @Column({
        name: 'idSchedulePrime',
        type: 'varchar',
        length: 45,
        nullable: true,
    })
    idSchedulePrime: string | undefined;

    @Column({ name: 'needPayment', type: 'boolean' })
    needPayment: boolean | undefined;

    @Column({ name: 'valuePayment', type: 'decimal', nullable: true })
    valuePayment: string | undefined;

    @Column({ name: 'hasGuests', type: 'boolean' })
    hasGuests: boolean | undefined;

    @Column({ name: 'hourValidation', type: 'boolean' })
    hourValidation: boolean | undefined;

    @Column({ name: 'urlAttachment', type: 'varchar', length: 200 })
    urlAttachment: string | undefined;

    @Column({
        name: 'urlAttachment_en',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    urlAttachmentEN: string | undefined;

    @Column({ name: 'titleOne', type: 'varchar', length: 120, nullable: true })
    titleOne: string | undefined;

    @Column({
        name: 'titleOne_en',
        type: 'varchar',
        length: 120,
        nullable: true,
    })
    titleOneEN: string | undefined;

    @Column({
        name: 'urlAttachmentOne',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    urlAttachmentOne: string | undefined;

    @Column({
        name: 'urlAttachmentOne_en',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    urlAttachmentOneEN: string | undefined;

    @Column({ name: 'titleTwo', type: 'varchar', length: 120, nullable: true })
    titleTwo: string | undefined;

    @Column({
        name: 'titleTwo_en',
        type: 'varchar',
        length: 120,
        nullable: true,
    })
    titleTwoEN: string | undefined;

    @Column({
        name: 'urlAttachmentTwo',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    urlAttachmentTwo: string | undefined;

    @Column({
        name: 'urlAttachmentTwo_en',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    urlAttachmentTwoEN: string | undefined;

    @Column({
        name: 'titleThree',
        type: 'varchar',
        length: 120,
        nullable: true,
    })
    titleThree: string | undefined;

    @Column({
        name: 'titleThree_en',
        type: 'varchar',
        length: 120,
        nullable: true,
    })
    titleThreeEN: string | undefined;

    @Column({
        name: 'urlAttachmentThree',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    urlAttachmentThree: string | undefined;

    @Column({
        name: 'urlAttachmentThree_en',
        type: 'varchar',
        length: 200,
        nullable: true,
    })
    urlAttachmentThreeEN: string | undefined;

    @Column({ name: 'status', type: 'boolean', default: true })
    status: boolean | undefined;

    @Column({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date | undefined;

    @Column({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date | undefined;

    @Column({ name: 'active', type: 'boolean' })
    isActive: boolean | undefined;

    @OneToMany(
        () => ServiceEnterpriseEntity,
        orderDetails => orderDetails.service,
    )
    serviceEnterprise: ServiceEnterpriseEntity | undefined;
}

export { ServiceEntity };
