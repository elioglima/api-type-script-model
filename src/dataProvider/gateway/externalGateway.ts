import Axios, { AxiosRequestConfig } from 'axios';
import debug from 'debug';

export default class ExternalGateway {
    private logger = debug('ExternalGateway');

    public async find(parm1: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.EXTERNAL_HOST}/v1/endpoint/${parm1}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request ExternalGateway api started!', config);

        return await Axios(config)
            .then(({ status, data }) => {
                this.logger('Response Axios :', status, data);
                if (status !== 204) {
                    return data;
                }

                return status;
            })
            .catch(err => err);
    }
}
