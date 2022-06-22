import Axios, { AxiosRequestConfig } from 'axios';

export default class ApartmentGateway {
    public async findByUserId(userId: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.APARTMENT_HOST}/v1/apartmentuser/user/${userId}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        return await Axios(config)
            .then(response => response)
            .catch(err => err);
    }
}
