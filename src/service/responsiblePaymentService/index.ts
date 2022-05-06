import debug from 'debug';
import { ResponsiblePaymentRepository } from '../../dataProvider/repository/ResponsiblePaymentRepository';
import { TResponsiblePayment } from '../../domain/Tegrus/TResponsiblePayment';

export default class ResponsiblePaymentService {
    private logger = debug('payment-api:ResponsiblePaymentService');
    private repository = new ResponsiblePaymentRepository();

    public IncludeOrUpdate = async (
        responsiblePayment: TResponsiblePayment,
    ) => {
        console.log(777, 'IncludeOrUpdate', responsiblePayment);
        if (responsiblePayment?.id) {
            const resFindOne: any = await this.FindOne(
                Number(responsiblePayment.id),
            );
            console.log(777, 'IncludeOrUpdate', resFindOne);
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

                console.log(111, resFindOne);
                if (!resFindOne?.err && resFindOne?.data) return resFindOne;
            }

            this.logger('Starting method to create responsiblePayment');
            const resp: any = await this.repository.persist(responsiblePayment);
            console.log(777, resp);
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

            this.logger('Starting method to create responsiblePayment');
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
}
