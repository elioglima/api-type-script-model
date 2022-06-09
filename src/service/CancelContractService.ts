import debug from 'debug';
import UserGateway from '../dataProvider/gateway/UserGateway';
import { rSuccess } from '../utils';

export default class CancelContractService {
    private logger = debug('payment-api:CancelContractService');
    private userGateway = new UserGateway();

    public execute = async (id: number, exitDate: Date) => {
        try {
            this.logger(`Find Card Add`);
            const response = await this.userGateway.cancelContract(
                id,
                exitDate,
            );
            return rSuccess(response?.data);
        } catch (error: any) {
            console.log(77, error.response);
            return { err: true, data: error?.response?.data };
        }
    };
}
