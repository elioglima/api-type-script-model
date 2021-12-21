import { IPagination } from '../domain/IPagination';
import debug from 'debug';

export const Pagination = ({ data, current_page, page_size }: IPagination) => {
    const logger = debug('service-api:Pagination');
    logger(`Transforming data and pagination`);

    const [result, total_items] = data!;

    if (current_page && page_size) {
        const last_page = Math.ceil(total_items / Number(page_size));
        const total_pages = Math.ceil(total_items / Number(page_size));
        const has_next = Number(current_page) + 1 > last_page ? false : true;
        const has_previous = Number(current_page) - 1 < 1 ? false : true;

        return {
            data: result,
            page_info: {
                total_items,
                total_pages,
                current_page,
                page_size,
                has_next,
                has_previous,
                last_page: last_page === 0 ? 1 : last_page,
            },
        };
    }

    return result;
};
