import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export default async (data, options) => {
    try {
        const dataPost = JSON.stringify(data)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (options && options.headers)
            options.headers['Content-Length'] = Buffer.byteLength(dataPost);

        const response = await axios.post(
            `${options.hostname}/${options.path}`,
            dataPost,
            {
                headers: options.headers,
            },
        );

        if (
            response.statusCode &&
            [200, 201].indexOf(response.statusCode) === -1
        )
            return reject({
                err: true,
                data: {
                    message: response.message || 'unexpected error',
                },
            });

        const dataReturn = {
            ...camelcaseKeys(response.data, { deep: true }),
        };

        return dataReturn;
    } catch (error) {
        return {
            err: true,
            data: {
                message:
                    typeof error?.response?.data == 'string'
                        ? error?.response?.data
                        : error?.message || 'unexpected error',
            },
        };
    }
};
