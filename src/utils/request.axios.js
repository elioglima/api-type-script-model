import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

export default async (data = {}, options) => {
    try {
        const dataPost = JSON.stringify(data)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        let response;

        console.log(
            9998,
            `${options.hostname}/${options.path}`,
            JSON.stringify(dataPost, null, 4),
            JSON.stringify(options.headers, null, 4),
            JSON.stringify(options.method, null, 4),
        );

        if (options.method == 'PUT') {
            if (options && options.headers)
                options.headers['Content-Length'] = Buffer.byteLength(dataPost);

            console.log(`url:${options.hostname}${options.path}`);

            response = await axios.put(
                `${options.hostname}${options.path}`,
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
            return {
                err: true,
                data: {
                    message: response.data,
                    status: response.statusCode,
                },
            };

        const dataReturn = {
            ...camelcaseKeys(response.data, { deep: true }),
        };

        return dataReturn;
    } catch (error) {
        console.log(11111111, 'dataReturn.error', error.response.statusText);
        console.log(error?.response);
        return {
            err: true,
            data: {
                status: error?.response?.status,
                message: error?.response?.statusText || 'unexpected error',
                message: error?.response?.data || 'no data',
            },
        };
    }
};
