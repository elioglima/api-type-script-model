import debug from 'debug';
import { HashDataRepository } from '../../../dataProvider/repository/HashDataRepository';
import { InvoiceRepository } from '../../../dataProvider/repository/InvoiceRepository';
import {
    resHashData,
    EnumInvoiceStatus,
    TInvoice,
} from '../../../domain/Tegrus';
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
                    err: false,
                    data: {
                        code: 2,
                        message: 'hash already used.',
                    },
                };
            }

            const resInvoicePreUser: any = await this.InvRep.getByInvoiceId(
                resp.invoiceId,
            );

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

            const invoice: TInvoice = resInvoicePreUser?.data;

            if (invoice.statusInvoice == EnumInvoiceStatus.paid) {
                return {
                    err: true,
                    data: {
                        code: 6,
                        message: 'invoice is already paid',
                    },
                };
            }

            if (invoice.statusInvoice == EnumInvoiceStatus.expired) {
                return {
                    err: true,
                    data: {
                        code: 7,
                        message: 'invoice is expired',
                    },
                };
            }

            const timeNow: Date = moment().toDate();
            if (moment(invoice.dueDate).add('days', 1).isBefore(timeNow)) {
                await this.TerminateHashTTL(String(resp));
                await this.InvRep.update({
                    ...invoice,
                    statusInvoice: EnumInvoiceStatus.expired,
                });

                return {
                    err: true,
                    data: {
                        code: 7,
                        message: 'invoice is expired',
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
                        message: 'the hash is not valid',
                    },
                };
            }

            if (resValidate?.data?.isExpired) {
                // atualizar

                await this.InvRep.update({
                    ...invoice,
                    statusInvoice: EnumInvoiceStatus.expired,
                });

                return {
                    err: true,
                    data: {
                        code: 7,
                        message: 'invoice is expired',
                    },
                };
            }

            const res: resHashData = {
                resident: resInvoicePreUser.resident,
                invoice: delete resInvoicePreUser.resident && resInvoicePreUser,
            };

            return res;
        } catch (error) {
            return {
                code: 8,
                message: 'unexpected error',
                err: true,
            };
        }
    }

    private async validateHashTTL(hashData: resHashData) {
        try {
            const timeNow: Date = moment().toDate();
            if (moment(hashData.lifeTime).add('days', 1).isBefore(timeNow)) {
                await this.TerminateHashTTL(String(hashData.hash));
                return {
                    err: false,
                    data: {
                        message: 'hash expired or is invalid.',
                        isValid: false,
                        isExpired: true,
                    },
                };
            }

            return {
                err: false,
                data: {
                    isValid: true,
                    isExpired: false,
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

    public async TerminateHashTTL(hash: string) {
        try {
            const resp = await this.HashRep.update(hash);
            if (resp.err) return { err: true, data: resp.err };
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
