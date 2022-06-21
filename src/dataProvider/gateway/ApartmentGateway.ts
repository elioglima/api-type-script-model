import Axios, { AxiosRequestConfig } from 'axios';
import debug from 'debug';

export default class ApartmentGateway {
    private logger = debug('bff:ApartmentGateway');

    public async findById(idApartment: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.APARTMENT_HOST}/v1/apartment/${idApartment}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request apartment api started!', config);

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

    public async findByExternalId(externalId: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.APARTMENT_HOST}/v1/apartment/external/${externalId}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };

        return await Axios(config)
            .then(response => response)
            .catch(err => err);
    }

    public async findAll() {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.APARTMENT_HOST}/v1/apartment/`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request apartment api started!', config);

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
