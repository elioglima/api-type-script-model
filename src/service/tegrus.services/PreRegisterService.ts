import { PreRegistrationRepository } from './../../dataProvider/repository/PreRegisterRepository';
import { TResident } from './../../domain/Tegrus/TResident';
import debug from 'debug';


export default class PreRegisterService {
    private logger = debug('service-api:PreRegisterService');
    private preRegister = new PreRegistrationRepository();


    public async execute(resident: TResident) {
        try {
            this.logger('Starting method to create Payment');
            const resp: any = await this.preRegister.persist(resident)            
            if (resp?.error == true) {
                return {
                    err: true,
                    data: resp.data
                }
            }
            return resp
        } catch (error) {
            console.log(error)
            return error
        }
    }
}
