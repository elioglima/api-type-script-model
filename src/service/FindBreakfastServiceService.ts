import debug from 'debug';
import { ServiceRepository } from '../../dataProvider/repository/ServiceRepository';
import { SystemMessages } from '../../enum/SystemMessages';

export class FindBreakfastServiceService {
    private logger = debug('service-api:FindBreakfastServiceService');
    private serviceRepository: ServiceRepository = new ServiceRepository();

    public execute = async (idEnterprise: number) => {
        this.logger(`${SystemMessages.FIND_BY_SERVICE} service id`);
        return this.serviceRepository.getBreakFast(idEnterprise).then(
            data => {
                if (data === undefined) {
                    this.logger(
                        `${SystemMessages.ERROR}: breakfast for enterprise ${idEnterprise} not found`,
                    );
                    return new Error(
                        `breakfast for enterprise ${idEnterprise} not found`,
                    );
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
