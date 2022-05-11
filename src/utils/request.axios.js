import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export default async (data = {}, options) => {
    try {
        const dataPost = JSON.stringify(data)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        let response;

        if (options.method == 'PUT') {
            if (options && options.headers)
                options.headers['Content-Length'] = Buffer.byteLength(dataPost);

            response = await axios.put(
                `${options.hostname}/${options.path}`,
                dataPost,
                {
                    timeout: 5000,
                    headers: options.headers,
                },
            );
        } else if (options.method == 'GET') {
            const url = `${options.hostname}/${options.path}`;
            response = await axios.get(url, {
                timeout: 5000,
                headers: options.headers,
            });
        } else if (options.method == 'POST') {
            if (options && options.headers)
                options.headers['Content-Length'] = Buffer.byteLength(dataPost);

            response = await axios.post(
                `${options.hostname}/${options.path}`,
                dataPost,
                {
                    timeout: 5000,
                    headers: options.headers,
                },
            );
        } else {
            return {
                err: true,
                data: {
                    message: 'Method undefined',
                },
            };
        }

        if (
            response.statusCode &&
            [200, 201].indexOf(response.statusCode) === -1
        )
            return reject({
                err: true,
                data: {
                    message: response.data,
                    status: response.status,
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
