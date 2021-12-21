import debug from 'debug';
import { getConnection } from 'typeorm';
import { ServiceEntity } from '../entity/PaymentEntity';
import { Service } from '../../domain/Service';
import { IFilter } from '../../domain/IFilter';
import { IPagination } from '../../domain/IPagination';

export class ServiceRepository {
    private logger = debug('service-api:ServiceRepository');

    public persist = async (service: Service) =>
        await getConnection()
            .getRepository(ServiceEntity)
            .createQueryBuilder('service')
            .insert()
            .values([
                {
                    title: service.title,
                    titleEN: service.titleEN,
                    titleOne: service.titleOne,
                    titleOneEN: service.titleOneEN,
                    titleTwo: service.titleTwo,
                    titleTwoEN: service.titleTwoEN,
                    titleThree: service.titleThree,
                    titleThreeEN: service.titleThreeEN,
                    description: service.description,
                    descriptionEN: service.descriptionEN,
                    condicoes: service.condicoes,
                    condicoesEN: service.condicoesEN,
                    localization: service.localization,
                    localizationEN: service.localizationEN,
                    hasSchedule: service.hasSchedule,
                    idSchedule: service.idSchedule,
                    idSchedulePrime: service.idSchedulePrime,
                    needPayment: service.needPayment,
                    valuePayment: service.valuePayment,
                    hasGuests: service.hasGuests,
                    hasCredit: service.hasCredit,
                    hourValidation: service.hourValidation,
                    urlAttachment: service.urlAttachment,
                    urlAttachmentEN: service.urlAttachmentEN,
                    urlAttachmentOne: service.urlAttachmentOne,
                    urlAttachmentOneEN: service.urlAttachmentOneEN,
                    urlAttachmentTwo: service.urlAttachmentTwo,
                    urlAttachmentTwoEN: service.urlAttachmentTwoEN,
                    urlAttachmentThree: service.urlAttachmentThree,
                    urlAttachmentThreeEN: service.urlAttachmentThreeEN,
                    status: service.status,
                    isActive: true,
                },
            ])
            .execute()
            .then(
                response => {
                    service.idService = Number(
                        response.identifiers[0].idService,
                    );
                    return service;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );

    public getAll = async (
        { hasSchedule, search, order, idEnterprise, filterStatus, language }: IFilter,
        { current_page, page_size }: IPagination,
    ) => {
        const findTitle = language === "pt_BR" ? 'service.title' : 'service.title_en'
        const getAll = getConnection()
            .getRepository(ServiceEntity)
            .createQueryBuilder('service')
            .leftJoinAndSelect('service.serviceEnterprise', 'serviceEnterprise')
            .where('service.active = true')
            .orderBy(`${findTitle}`, `${order}`);

        if (filterStatus) {
            getAll.andWhere('service.status = true');
        }

        if (hasSchedule) {
            getAll.andWhere(`service.hasSchedule = :hasSchedule`, {
                hasSchedule,
            });
        }
        if (search) {
            getAll.andWhere(`${findTitle} LIKE :search`, {
                search: `%${search}%`,
            });

        }
        if (idEnterprise) {
            getAll.andWhere('serviceEnterprise.idEnterprise = :idEnterprise', {
                idEnterprise,
            });
        }

        if (current_page && page_size) {
            getAll.skip(page_size * (current_page - 1));
            getAll.take(page_size);
        }

        return getAll.getManyAndCount();
    };

    public getById = async (idService: number, isActive: boolean) =>
        await getConnection()
            .getRepository(ServiceEntity)
            .createQueryBuilder('service')
            .leftJoinAndSelect('service.serviceEnterprise', 'serviceEnterprise')
            .where('service.idService = :idService', { idService })
            .andWhere('service.active = :isActive', { isActive })
            .getOne();

    public getBreakFast = async (idEnterprise: number) =>
        await getConnection()
            .getRepository(ServiceEntity)
            .createQueryBuilder('service')
            .leftJoinAndSelect('service.serviceEnterprise', 'serviceEnterprise')
            .where('service.title LIKE "%Café%"')
            .andWhere('service.active = true')
            .andWhere('serviceEnterprise.idEnterprise = :idEnterprise', {
                idEnterprise,
            })
            .getOne();

    public update = async (service: Service) => {
        return await getConnection()
            .getRepository(ServiceEntity)
            .createQueryBuilder('service')
            .update()
            .set(service)
            .where('idService = :idService', { idService: service.idService })
            .execute()
            .then(
                () => {
                    return service;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };
}
