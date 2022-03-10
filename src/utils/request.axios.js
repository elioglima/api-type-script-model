import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export default async (data, options) => {
    try {
        const dataPost = JSON.stringify(data)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (options && options.headers)
            options.headers['Content-Length'] = Buffer.byteLength(dataPost);

        let response;

        if (options.method == 'PUT') {
            response = await axios.put(
                `${options.hostname}/${options.path}`,
                dataPost,
                {
                    headers: options.headers,
                },
            );
        }
        else if (options.method == 'GET') {
            response = await axios.get(
                `${options.hostname}/${options.path}`,
                dataPost,
                {
                    headers: options.headers,
                },
            );
        }
        else if (options.method == 'POST') {
            response = await axios.post(
                `${options.hostname}/${options.path}`,
                dataPost,
                {
                    headers: options.headers,
                },
            );
        }
        else {
            return {
                err: true,
                data: {
                    message: 'Method undefined'
                },
            }
        }

        if (
            response.statusCode &&
            [200, 201].indexOf(response.statusCode) === -1
        )
            return reject({
                err: true,
                data: {
                    message: response.data,
                    status: response.status
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
                    error?.response?.statusText ||
                        typeof error?.response?.data == 'string'
                        ? error?.response?.data
                        : error?.message || 'unexpected error',
            },
        };
    }
};
