import debug from 'debug';
import { PreRegistrationRepository } from '../../dataProvider/repository/PreRegisterRepository';
import { TResident } from './../../domain/Tegrus/TResident';

export default class ResidentService {
    private logger = debug('payment-api:ResidentService');
    private repository = new PreRegistrationRepository();

    public async add(resident: TResident) {
        try {
            const resFindOne = await this.FindOne(resident.id);
            if (!resFindOne?.err && resFindOne?.data) return resFindOne;

            this.logger('Starting method to create Payment');
            const resp: any = await this.repository.persist(resident);
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
        this.logger(`Find One Include`);

        const resResident: TResident = await this.repository.getById(id);

        if (resResident instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'No resident found',
                },
            };
        }

        return {
            err: false,
            data: resResident,
        };
    };
}
