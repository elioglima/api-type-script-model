import debug from 'debug';
import { ServiceRepository } from '../../dataProvider/repository/ServiceRepository';
import { ServiceEnterpriseRepository } from '../../dataProvider/repository/ServiceEnterpriseRepository';
import { Service } from '../../domain/Service';
import { SystemMessages } from '../../enum/SystemMessages';
import { ServiceEnterprise } from '../../domain/ServiceEnterprise';
import { ProductTypeRepository } from '../../dataProvider/repository/ProductTypeRepository';
import { ProductRepository } from '../../dataProvider/repository/ProductRepository';
import { ProductTypeEntity } from '../../dataProvider/entity/ProductTypeEntity';

export class CreateServiceService {
    private logger = debug('service-api:CreateServiceService');
    private serviceRepository = new ServiceRepository();
    private productTypeRepository = new ProductTypeRepository();
    private productRepository = new ProductRepository();
    private serviceEnterpriseRepository = new ServiceEnterpriseRepository();

    private async createServiceEnterprise(service: Service, result: Service) {
        if (service.idEnterprise) {
            return await Promise.all(
                service.idEnterprise.map(async enterprise => {
                    const serviceEnterprise = {
                        service: { idService: result.idService },
                        idEnterprise: enterprise,
                    };
                    return this.serviceEnterpriseRepository.persist(
                        <ServiceEnterprise>serviceEnterprise,
                    );
                }),
            ).then(result => result);
        }
    }

    public async createProductForService(service: Service) {
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

            this.productRepository.create(productData);
        }
    }

    public async execute(service: Service) {
        if (!service.idEnterprise) {
            this.logger(`${SystemMessages.ERROR} no id enterprise found`);
            return new Error('no id enterprise found');
        }

        this.logger(`${SystemMessages.CREATE_SERVICE} service`);
        const result = await this.serviceRepository
            .persist(service)
            .then(hasPersist => hasPersist);

        this.logger(`${SystemMessages.CREATE_SERVICE} service enterprise`);
        const serviceEnterpriseResult = await this.createServiceEnterprise(
            service,
            result,
        )
            .then(() => result)
            .catch(err => err);

        if (service.hasSchedule) this.createProductForService(service);

        return serviceEnterpriseResult;
    }
}
