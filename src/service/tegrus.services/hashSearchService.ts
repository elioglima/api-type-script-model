
import debug from 'debug';
import { HashDataRepository } from 'src/dataProvider/repository/HashDataRepository';

export default class HashSearchService {
    private logger = debug('service-api:HashService');
    private HashRep = new HashDataRepository();


    public async execute(hash: string) {
        try {
            this.logger('Starting method to create Payment');
            const resp: any = await this.HashRep.getByHash(hash)
            if (resp?.error == true) {
                return {
                    err: true,
                    data: resp
                }
            }
            return resp
        } catch (error) {
            console.log(error)
            return error
        }
    }
}
