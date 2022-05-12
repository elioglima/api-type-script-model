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

            if (!resp) {
                return {
                    err: true,
                    data: {
                        code: 1,
                        message: 'Hash dont found.',
                    },
                };
            }

            if (!resp?.valid) {
                return {
                    err: true,
                    data: {
                        code: 2,
                        message: 'hash already used.',
                    },
                };
            }

            const resValidate = await this.validateHashTTL(resp);
            if (resValidate.err) {
                return {
                    err: true,
                    data: {
                        code: 3,
                        ...resValidate.data,
                    },
                };
            }

            if (!resValidate?.data?.isValid) {
                return {
                    err: false,
                    data: {
                        code: 4,
                        ...resValidate.data,
                    },
                };
            }

            const resInvoicePreUser: any = await this.InvRep.getByInvoiceId(
                resp.invoiceId,
            );

            const timeNow: Date = moment().toDate();

            resInvoicePreUser.invoiceHasExpired = moment(
                resInvoicePreUser.dueDate,
            ).isBefore(timeNow);

            if (resInvoicePreUser.invoiceHasExpired) {
                return {
                    err: true,
                    data: {
                        code: 7,
                        message: 'dueDate has expired.',
                    },
                };
            }

            if (!resInvoicePreUser)
                return {
                    err: true,
                    data: {
                        code: 5,
                        message: 'Invoice doesnt found.',
                    },
                };

            if (resInvoicePreUser instanceof Error)
                return { err: true, data: resInvoicePreUser };

            const res: resHashData = {
                resident: resInvoicePreUser.resident,
                invoice: delete resInvoicePreUser.resident && resInvoicePreUser,
            };

            if (res.invoice.statusInvoice == 'paid') {
                const teste = await this.terminateHashTTL(hash);
                console.log(teste, hash);
                return {
                    err: true,
                    data: {
                        code: 6,
                        message: 'invoice is already paid',
                    },
                };
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
        try {
            const timeNow: Date = moment().toDate();
            if (moment(hashData.lifeTime).isBefore(timeNow)) {
                await this.terminateHashTTL(String(hashData.hash));
                return {
                    err: false,
                    data: {
                        err: false,
                        data: {
                            message: 'hash expired or is invalid.',
                            isValid: false,
                        },
                    },
                };
            }

            return {
                err: false,
                data: {
                    isValid: true,
                },
            };
        } catch (error: any) {
            return {
                err: true,
                data: {
                    message: error?.message || 'unexpected error',
                },
            };
        }
    }

    private async terminateHashTTL(hash: string) {
        try {
            const resp = await this.HashRep.update(hash);
            if (resp.err) {
                return { err: true, data: resp.err };
            }

            return resp;
        } catch (error: any) {
            return {
                err: true,
                data: {
                    message: error?.message,
                },
            };
        }
    }
}
