import debug from 'debug';
import { AdapterPayment } from '../../domain/AdapterPayment';
import { InvoiceRepository } from '../../dataProvider/repository/InvoiceRepository';
import { TInvoice, TInvoiceFilter, TResident } from '../../domain/Tegrus';
import { EnumInvoiceStatus } from '../../domain/Tegrus/EnumInvoiceStatus';

export default class InvoiceService {
    private logger = debug('payment-api:InvoiceService');
    private invoiceRepository = new InvoiceRepository();

    public getAll = async () => {
        this.logger(`Find All invoices`);
        const data = await this.invoiceRepository.getAll();

        if (data == undefined) {
            return new Error('Invoices not found');
        }
        return data;
    };

    public FindOneResidentId = async (residentId: number) => {
        this.logger(`Find One ResidentID`);

        const resInvoiceId = await this.invoiceRepository.getByResidentId(
            residentId,
        );

        if (resInvoiceId instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'no invoice found',
                },
            };
        }

        return {
            err: false,
            data: resInvoiceId,
        };
    };

    public FindOne = async (invoiceId: number) => {
        try {
            this.logger(`Find One`);

            const resInvoiceId = await this.invoiceRepository.getByInvoiceId(
                invoiceId,
            );

            if (resInvoiceId instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: 'no invoice found',
                    },
                };
            }

            return {
                err: false,
                data: resInvoiceId,
            };
        } catch (error) {
            console.log(444, error);
            return {
                err: true,
                data: {
                    message: 'no invoice found',
                },
            };
        }
    };

    public FindOneDisabled = async (invoiceId: number) => {
        this.logger(`Find One FindOneDisabled`);

        const resInvoiceId: TInvoice =
            await this.invoiceRepository.getByInvoiceId(invoiceId);

        if (resInvoiceId instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        const resInvoiceUpdate: TInvoice = await this.invoiceRepository.update({
            ...resInvoiceId,
            invoiceId: invoiceId,
            active: false,
        });

        if (resInvoiceUpdate instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        return {
            err: false,
            data: resInvoiceId,
        };
    };

    public FindOneInclude = async (invoiceData: TInvoice) => {
        try {
            this.logger(`Find One Include`);

            const { resident: residentData, ...invoiceTwo }: any = invoiceData;
            const resident: TResident = residentData;
            const invoice: TInvoice = invoiceTwo;
            console.log(777, invoice.invoiceId);
            const resInvoiceId = await this.invoiceRepository.getByInvoiceId(
                invoice.invoiceId,
            );

            if (resInvoiceId instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: 'Error query invoice',
                    },
                };
            }

            if (resInvoiceId) {
                if (resInvoiceId.statusInvoice == EnumInvoiceStatus.paid) {
                    return {
                        err: true,
                        data: {
                            message:
                                'Invoice is already processed and paid status.',
                        },
                    };
                }

                const resInvoiceUpdate: any =
                    await this.invoiceRepository.update({
                        ...invoice,
                    });

                return {
                    err: false,
                    data: {
                        message: 'Invoice is already processed',
                        update: resInvoiceUpdate?.affected == 1,
                        invoice: resInvoiceId,
                    },
                };
            }

            const resPersist = await this.invoiceRepository.persist({
                ...invoice,
                residentIdenty: resident.id,
            });

            if (resPersist instanceof Error) {
                console.log(resPersist);
                return {
                    err: true,
                    data: {
                        message: 'Error writing invoice',
                    },
                };
            }

            return {
                err: false,
                data: resPersist,
            };
        } catch (error) {
            console.log(333, error);
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }
    };

    public Find = async (payload: TInvoiceFilter) => {
        this.logger(`Find`);

        const resInvoiceFind: any = await this.invoiceRepository.Find(payload);
        if (resInvoiceFind instanceof Error) {
            return {
                err: true,
                data: {
                    message: 'Error writing invoice',
                },
            };
        }

        if (resInvoiceFind.err) return resInvoiceFind;
        return {
            err: false,
            data: resInvoiceFind,
        };
    };

    public Update = async (payload: TInvoice) => {
        try {
            this.logger(`Update`);
            const resInvoiceUpdate: any = await this.invoiceRepository.update(
                payload,
            );

            if (resInvoiceUpdate instanceof Error) {
                return {
                    err: true,
                    data: {
                        message: 'Error writing invoice in database',
                    },
                };
            }

            const invoice: TInvoice = resInvoiceUpdate;
            if (resInvoiceUpdate.err)
                return {
                    err: true,
                    data: {
                        message: 'data updated successfully in database',
                        row: invoice,
                    },
                };

            return {
                err: false,
                data: resInvoiceUpdate,
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

    public GetInvoiceCielo = async (
        paymentId: string,
        enterpriseId: number,
    ) => {
        this.logger(`GetInvoiceCielo`);
        try {
            const paymentAdapter = new AdapterPayment();
            await paymentAdapter.init(enterpriseId);
            const response = await paymentAdapter.find({ paymentId });
            return response;
        } catch (error: any) {
            console.log('ERROR', error);
            return {
                err: true,
                data: {
                    message: error?.message || 'unexpected error',
                },
            };
        }
    };
}
