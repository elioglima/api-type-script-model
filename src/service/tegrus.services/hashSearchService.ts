import debug from 'debug';
import { HashDataRepository } from '../../dataProvider/repository/HashDataRepository';
import { InvoiceRepository } from '../../dataProvider/repository/InvoiceRepository';
import { resHashData } from '../../domain/Tegrus';
import moment from 'moment';

export default class HashSearchService {
    private logger = debug('service-api:HashSearchService');
    private HashRep = new HashDataRepository();
    private InvRep = new InvoiceRepository();

    public async execute(hash: string) {
        try {
            this.logger('Starting method HashSearchService');
            const resp: any = await this.HashRep.getByHash(hash);                        

            if(!resp) {
                return {
                    err: true,
                    data: 'Hash dont found.'
                };
            }

            if (resp?.err) {
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
                return resValidate;
            }

            const resInvoicePreUser: any = await this.InvRep.getByInvoiceId(
                resp.invoiceId,
            );

            if(!resInvoicePreUser) return {err: true, data: "Invoice doesnt found."}

            if(resInvoicePreUser instanceof Error) return {err: true, data: resInvoicePreUser}
                 
            const res: resHashData = {
                resident: resInvoicePreUser.resident,
                invoice: delete resInvoicePreUser.resident && resInvoicePreUser,
            }
            
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
        if (moment(hashData.lifeTime).isBefore(timeNow)) {
            const resp = await this.terminateHashTTL(String(hashData.hash));
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
                    isValid: false,
                },
            };
        }

        return {
            err: false,
            data: {
                isValid: true,
            },
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
