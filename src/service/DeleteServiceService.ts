import debug from 'debug';
import { ServiceRepository } from '../../dataProvider/repository/ServiceRepository';
import { FindServiceByIdService } from './FindServiceByIdService';
import { ServiceEntity } from '../../dataProvider/entity/ServiceEntity';
import { SystemMessages } from '../../enum/SystemMessages';
import { Service } from '../../domain/Service';

export class DeleteServiceService {
    private logger = debug('service-api:DeleteServiceService');
    private serviceRepository: ServiceRepository = new ServiceRepository();
    private findServiceByIdService: FindServiceByIdService =
        new FindServiceByIdService();

    async execute(idService: number) {
        const hasService = await this.findServiceByIdService.execute(idService);

        if (hasService instanceof Error) {
            this.logger(SystemMessages.ERROR, hasService);
            return hasService;
        }

        if (hasService instanceof ServiceEntity) {
            this.logger(`${SystemMessages.DELETE_SERVICE} service`);
            delete hasService.serviceEnterprise;
            hasService.isActive = false;
            return this.serviceRepository
                .update(<Service>hasService)
                .then(hasUpdate => hasUpdate);
        }

        return hasService;
    }
}
