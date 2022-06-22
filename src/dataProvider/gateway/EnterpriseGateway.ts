import Axios, { AxiosRequestConfig } from 'axios';
import debug from 'debug';

export default class EnterpriseGateway {
    private logger = debug('bff:EnterpriseGateway');

    public async findById(idEnterprise: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.ENTERPRISE_HOST}/v1/enterprise/${idEnterprise}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request enterprise api started!', config);

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

    public async findAll() {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.ENTERPRISE_HOST}/v1/enterprise/`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request enterprise api started!', config);

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
