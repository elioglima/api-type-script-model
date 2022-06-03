import Axios, { AxiosRequestConfig } from 'axios';
import debug from 'debug';
import User from '../../domain/User';

export default class UserGateway {
    private logger = debug('payment-api: UserGateway');
    private request = Axios.create({
        baseURL: `${process.env.USER_HOST}/v1/user`,
    });

    public cancelContract = async (id: number, exitDate: Date) => {
        const { data } = await this.request.post('/contract/cancel', {
            id,
            exitDate,
        });

        this.logger('Response UserGateway\n', data);
        return data;
    };

    public async findAll(perfil: number | null = null) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/user/`,
            method: 'GET',
            params: {
                perfil,
            },
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

        return await Axios(config)
            .then(({ status, data }) => {
                this.logger('Response Axios :', status, data);
                if (status !== 204) {
                    return data;
                }

                return true;
            })
            .catch(err => err);
    }

    public async create(user: User) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/user`,
            method: 'POST',
            data: {
                name: user.getName(),
                backofficeItems: user.getbackofficeItems(),
                nickname: user.getNickname(),
                birthDate: user.getBirthDate(),
                smartphone: user.getSmartphone(),
                document: user.getDocument(),
                documentType: user.getDocumentType(),
                isActive: user.getActive(),
                perfil: {
                    id: 1,
                },
            },
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

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

    public async update(user: User) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/user`,
            method: 'PUT',
            data: {
                id: user.getId(),
                name: user.getName(),
                backofficeItems: user.getbackofficeItems(),
                nickname: user.getNickname(),
                birthDate: user.getBirthDate(),
                smartphone: user.getSmartphone(),
                document: user.getDocument(),
                documentType: user.getDocumentType(),
                isActive: user.getActive(),
                urlAttachment: user.getUrlAttachment(),
            },
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

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

    public async delete(idUser: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/user/${idUser}`,
            method: 'DELETE',

            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

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

    public async findAllDependent() {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/dependent/`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

        return await Axios(config)
            .then(({ status, data }) => {
                this.logger('Response Axios :', status, data);
                if (status !== 204) {
                    return data;
                }

                return true;
            })
            .catch(err => err);
    }

    public async findById(userId: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/user/${userId}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

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

    public async findUserPerfilAccess(userId: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/perfiluser/user/${userId}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

        return await Axios(config)
            .then(({ status, data }) => {
                this.logger('Response Axios :', status, data);
                if (status !== 204) {
                    return data;
                }

                return true;
            })
            .catch(err => err);
    }

    public async findDependentByHolderId(holderId: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/dependent/holder/${holderId}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request dependent api started!', config);

        return await Axios(config)
            .then(({ status, data }) => {
                this.logger('Response Axios :', status, data);
                if (status !== 204) {
                    return data;
                }

                return true;
            })
            .catch(err => err);
    }

    public async findBackofficeItems(channelId: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/backofficeItems/`,
            method: 'GET',
            params: {
                channelId,
            },
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

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

    public async findUserBackofficeAccess(userId: number) {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.USER_HOST}/v1/userBackofficeItems/user/${userId}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

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
            baseURL: `${process.env.USER_HOST}/v1/user/external/${externalId}`,
            method: 'GET',
            validateStatus: status => status < 500,
        };
        this.logger('Request user api started!', config);

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
