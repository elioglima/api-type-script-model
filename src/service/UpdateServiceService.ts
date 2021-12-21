import debug from 'debug';
import { ServiceRepository } from '../../dataProvider/repository/ServiceRepository';
import { ServiceEnterpriseRepository } from '../../dataProvider/repository/ServiceEnterpriseRepository';
import { FindServiceByIdService } from './FindServiceByIdService';
import { ServiceEntity } from '../../dataProvider/entity/ServiceEntity';
import { SystemMessages } from '../../enum/SystemMessages';
import { Service } from '../../domain/Service';
import { ServiceEnterprise } from '../../domain/ServiceEnterprise';

import { FindProductByIdService } from '../product/FindProductByIdService';
import { CreateProductService } from '../product/CreateProductService';
import { ProductTypeEntity } from '../../dataProvider/entity/ProductTypeEntity';

import { ProductTypeRepository } from '../../dataProvider/repository/ProductTypeRepository';
import { ProductEntity } from '../../dataProvider/entity/ProductEntity';

export class UpdateServiceService {
    private logger = debug('service-api:UpdateServiceService');
    private serviceRepository = new ServiceRepository();
    private findServiceByIdService = new FindServiceByIdService();
    private serviceEnterpriseRepository = new ServiceEnterpriseRepository();
    private findProductByIdService = new FindProductByIdService();
    private createProductService = new CreateProductService();
    private productTypeRepository = new ProductTypeRepository();

    private async createServiceEnterprise(
        idEnterprise: Array<number>,
        service: Service,
    ) {
        return await Promise.all(
            idEnterprise.map(async enterprise => {
                const serviceEnterprise = {
                    service: { idService: service.idService },
                    idEnterprise: enterprise,
                };
                return this.serviceEnterpriseRepository.persist(
                    <ServiceEnterprise>serviceEnterprise,
                );
            }),
        ).then(result => result);
    }

    public async execute(service: Service) {
        if (!service.idEnterprise) {
            this.logger(`${SystemMessages.ERROR} no id enterprise found`);
            return new Error('no id enterprise found');
        }

        const hasService = await this.findServiceByIdService.execute(
            service.idService,
        );

        if (hasService instanceof Error) {
            this.logger(SystemMessages.ERROR, hasService);
            return hasService;
        }

        if (hasService instanceof ServiceEntity) {
            this.logger(`${SystemMessages.UPDATE_SERVICE} service`);

            const idEnterprise = service.idEnterprise;
            delete service.idEnterprise;

            delete hasService.serviceEnterprise;
            const result = await this.serviceRepository
                .update(service)
                .then(hasUpdate => hasUpdate);

            this.updateProductByService(service);
            await this.serviceEnterpriseRepository.delete(service.idService);

            this.logger(`${SystemMessages.CREATE_SERVICE} service enterprise`);
            return await this.createServiceEnterprise(idEnterprise, service)
                .then(enterprise => ({ ...result, enterprise }))
                .catch(err => err);
        }
    }

    private async updateProductByService(service: Service) {
        if (service.hasSchedule) {
            const findproduct = await this.findProductByIdService.execute(
                service.idService,
                true,
            );

            if (findproduct instanceof ProductEntity) {
                return;
            }

            let producyType = await this.productTypeRepository.findByParam({
                param: 'name',
                value: 'Outros',
            });

            if (producyType === undefined) {
                const producyTypeData: any = {
                    name: 'Outros',
                    nameEN: 'Others',
                };

                producyType = await this.productTypeRepository.create(
                    producyTypeData,
                );
            }

            if (producyType instanceof ProductTypeEntity) {
                const productData: any = {
                    name: service.title,
                    nameEN: service.titleEN,
                    description: service.description,
                    descriptionEN: service.descriptionEN,
                    price: 0,
                    productType: {
                        id: producyType.id,
                    },
                    service: {
                        idService: service.idService,
                    },
                };
                const createProduct = await this.createProductService.execute(
                    productData,
                );

                return createProduct;
            }
        }
    }
}
