import debug from 'debug';
import { ResponsiblePaymentRepository } from '../../dataProvider/repository/ResponsiblePaymentRepository';
import { TResponsiblePayment } from '../../domain/Tegrus/TResponsiblePayment';
import UserGateway from '../../dataProvider/gateway/UserGateway';
import ApartmentUserGateway from '../../dataProvider/gateway/ApartmentUserGateway';
import EnterpriseGateway from '../../dataProvider/gateway/EnterpriseGateway';

export default class ResponsiblePaymentService {
    private logger = debug('payment-api:ResponsiblePaymentService');
    private repository = new ResponsiblePaymentRepository();
    private userGateway = new UserGateway();
    private apartmentUserGateway = new ApartmentUserGateway();
    private enterpriseGateway = new EnterpriseGateway();

    public IncludeOrUpdate = async (
        responsiblePayment: TResponsiblePayment,
    ) => {
        if (responsiblePayment?.id) {
            const resFindOne: any = await this.FindOne(
                Number(responsiblePayment.id),
            );
            if (!resFindOne?.err) return resFindOne;
            if (resFindOne?.data?.id)
                return await this.update(responsiblePayment);
        }

        return await this.add(responsiblePayment);
    };

    public async add(responsiblePayment: TResponsiblePayment) {
        try {
            if (responsiblePayment?.id) {
                const resFindOne = await this.FindOne(
                    Number(responsiblePayment?.id),
                );

                if (!resFindOne?.err && resFindOne?.data) return resFindOne;
            }

            const resp: any = await this.repository.persist(responsiblePayment);
            if (resp?.error == true) {
                return {
                    err: true,
                    data: resp.data,
                };
            }
            return resp;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    public async update(responsiblePayment: TResponsiblePayment) {
        try {
            const resFindOne = await this.FindOne(
                Number(responsiblePayment.id),
            );
            if (!resFindOne?.err && !resFindOne?.data) return resFindOne;

            const resp: any = await this.repository.update(responsiblePayment);
            if (resp?.error == true) {
                return {
                    err: true,
                    data: resp.data,
                };
            }
            return resp;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    public FindOne = async (id: number) => {
        this.logger(`Find One`);
        try {
            const responsiblePayment: TResponsiblePayment =
                await this.repository.getById(id);

            if (responsiblePayment instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: 'No responsiblePayment found',
                    },
                };
            }

            return {
                err: false,
                data: responsiblePayment,
            };
        } catch (error: any) {
            return {
                err: true,
                data: {
                    message: error?.message || 'unexpected error',
                },
            };
        }
    };

    public FindOneAE = async (apartmentId: number, enterpriseId: number) => {
        this.logger(`Find One`);
        try {
            const responsiblePayment: TResponsiblePayment =
                await this.repository.FindOneAE({ apartmentId, enterpriseId });

            console.log(77555, {
                apartmentId,
                enterpriseId,
                responsiblePayment,
            });
            if (responsiblePayment instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: 'No responsiblePayment found',
                    },
                };
            }

            return {
                err: false,
                data: responsiblePayment,
            };
        } catch (error: any) {
            return {
                err: true,
                data: {
                    message: error?.message || 'unexpected error',
                },
            };
        }
    };

    public FindOneByUserId = async (userId: number) => {
        this.logger(`Find One`);
        try {
            const user: any = await this.userGateway.findById(userId);

            if (user instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: user.message,
                    },
                };
            }

            const resApartamentUser: any =
                await this.apartmentUserGateway.findByUserId(user?.id);

            if (resApartamentUser instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: resApartamentUser.message,
                    },
                };
            }

            const resEnterpriseGateway = await this.enterpriseGateway.findById(
                resApartamentUser?.data?.apartment?.idEnterprise,
            );

            if (resEnterpriseGateway instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: resEnterpriseGateway.message,
                    },
                };
            } else if (!resEnterpriseGateway) {
                return {
                    err: true,
                    data: {
                        message: 'Enterprise not located',
                    },
                };
            }

            const responsiblePayment: TResponsiblePayment =
                await this.repository.FindOneAE({
                    apartmentId: resApartamentUser?.data?.apartment?.externalId,
                    enterpriseId: resEnterpriseGateway?.externalId,
                });

            if (responsiblePayment instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: 'No responsiblePayment found',
                    },
                };
            }

            return {
                err: false,
                data: { isResponsiblePayment: responsiblePayment != undefined },
            };
        } catch (error: any) {
            return {
                err: true,
                data: {
                    message: error?.message || 'unexpected error',
                },
            };
        }
    };

    public deleteAll = async (apartmentId: number, enterpriseId: number) =>
        await this.repository.deleteAll({ apartmentId, enterpriseId });
}
