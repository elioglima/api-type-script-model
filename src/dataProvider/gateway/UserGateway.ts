import Axios from 'axios';
import debug from 'debug';

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
}
