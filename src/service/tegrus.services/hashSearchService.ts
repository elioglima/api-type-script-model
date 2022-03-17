import debug from 'debug';
import { HashDataRepository } from 'src/dataProvider/repository/HashDataRepository';
import { resHashData } from 'src/domain/Tegrus';
import moment from 'moment';

export default class HashSearchService {
    private logger = debug('service-api:HashSearchService');
    private HashRep = new HashDataRepository();

    public async execute(hash: string) {
        try {
            this.logger('Starting method HashSearchService');
            const resp: any = await this.HashRep.getByHash(hash);

            if (resp?.error == true) {
                return {
                    err: true,
                    data: resp,
                };
            }

            const resValidate = await this.validateHashTTL(resp);

            if (resValidate.err) {
                return resValidate;
            }

            if (!resValidate?.data?.isValid) {
                return resValidate                
            }

            const res: resHashData = {
                hash: resp.hash,
                link: resp.Link,
                lifeTime: resp.lifeTime,
                valid: Boolean(resValidate?.data?.isValid),
                invoice: resp.InvoiceEntity,
                preResident: resp.PreRegisterResidentEntity,
            };

            return res;
        } catch (error) {
            console.log(error);
            return {
                err: true,
                data: error,
            };
        }
    }

    private async validateHashTTL(hashData: resHashData) {
        const timeNow: Date = moment().toDate();
        if (moment(hashData.lifeTime).isAfter(timeNow)) {
            const resp = await this.terminateHashTTL(hashData.hash);
            if (resp.err) {
                return {
                    err: true,
                    data: {
                        isValid: false,
                    },
                };
            }
            return {
                err: false,
                data: {
                    isValid: true,
                }
            };
        }

        return {
            err: false,
            isValid: false,
        };
    }

    private async terminateHashTTL(hash: string) {
        try {
            const resp = await this.HashRep.update(hash);
            if (resp.err) {
                return { err: true, data: resp.err };
            }

            return resp;
        } catch (error) {
            return {
                err: true,
                data: error,
            };
        }
    }
}
