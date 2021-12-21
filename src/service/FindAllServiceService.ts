import debug from 'debug';
import { IFilter } from '../../domain/IFilter';
import { ServiceRepository } from '../../dataProvider/repository/ServiceRepository';
import { IPagination } from '../../domain/IPagination';
import { Pagination } from '../../utils/Pagination';
import { SystemMessages } from '../../enum/SystemMessages';

export class FindAllServiceService {
    private logger = debug('service-api:FindAllServiceService');
    private serviceRepository: ServiceRepository = new ServiceRepository();

    public execute = async (
        {
            hasSchedule,
            search,
            order = 'ASC',
            idEnterprise,
            filterStatus,
            language
        }: IFilter,
        { current_page, page_size }: IPagination,
    ) => {
        this.logger(`${SystemMessages.FIND_ALL_SERVICE} services`);

        const data = await this.serviceRepository.getAll(
            { hasSchedule, search, order, idEnterprise, filterStatus, language},
            { current_page, page_size },
        );

        return Pagination({ data, current_page, page_size });
    };
}
