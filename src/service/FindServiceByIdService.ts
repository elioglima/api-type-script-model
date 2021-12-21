import debug from 'debug';
import { ServiceRepository } from '../../dataProvider/repository/ServiceRepository';
import { SystemMessages } from '../../enum/SystemMessages';

export class FindServiceByIdService {
    private logger = debug('service-api:FindServiceByIdService');
    private serviceRepository: ServiceRepository = new ServiceRepository();

    public execute = async (idService: number, isActive: boolean = true) => {
        this.logger(`${SystemMessages.FIND_BY_SERVICE} service id`);
        return this.serviceRepository.getById(idService, isActive).then(
            data => {
                if (data === undefined) {
                    this.logger(
                        `${SystemMessages.ERROR}: service ${idService} not found`,
                    );
                    return new Error(`service ${idService} not found`);
                }

                this.logger(`${SystemMessages.SUCCESS_DATA}: ${data}`);
                return data;
            },
            err => {
                this.logger(`${SystemMessages.ERROR}: ${err}`);
                return new Error(err);
            },
        );
    };
}
