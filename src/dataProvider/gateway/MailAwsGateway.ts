import Axios, { AxiosRequestConfig } from 'axios';
import {
    TMailAws,
    TReqPaymentSuccess,
    TReqConfigurePayment,
    TReqErrorPayment,
    TReqFirstPayment,
    TReqForgotPassport,
    TReqInvoiceAvailable,
    TReqLinkPayment,
    TReqPaymentNew,
    TReqPaymentReject,
    TReqWelcome,
    TReqWelcomeUser,
} from '../../domain/MailAws';

export default class MailAwsGateway {
    private async sendMailAWS(mailbox: TMailAws) {
        const url: string = `${process.env.MAILBOX_HOST}`;
        const key: string = `${process.env.MAILBOX_HOST_KEY}`;

        const config: AxiosRequestConfig = {
            baseURL: `${url}`,
            method: 'POST',
            headers: {
                'x-api-key': `${key}`,
            },
            data: {
                ...mailbox,
            },
        };

        console.log(
            'MailAwsGateway.sendMailAWS :: ',
            JSON.stringify({ config }, null, 4),
        );

        const result: any = await Axios(config)
            .then(({ status, data }) => {
                console.log(
                    'MailAwsGateway.sendMailAWS.Axios.then :: ',
                    status,
                    data,
                );
                if (status !== 204) {
                    return data;
                }
                return { status, data };
            })
            .catch((error: any) => {
                console.log(
                    'MailAwsGateway.sendMailAWS.Axios.catch :: ',
                    error,
                );
                return {
                    err: true,
                    data: { error, message: 'Unexpect Error' },
                };
            });

        console.log('MailAwsGateway.sendMailAWS.result :: s', { result });
        return result;
    }

    public async configurePayment(payload: TReqConfigurePayment) {
        try {
            // ConfigurePayment - PT / EN - Cadastrar novo cartão (Cielo Negou) - Slide 8
            const mailbox: TMailAws = {
                template: 'configurePayment',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async errorPayment(payload: TReqErrorPayment) {
        try {
            // ErroPayment - PT/ EN - Pagamento n realizado - Slide 7
            // definicao para o robolo da payment-api
            const mailbox: TMailAws = {
                template: 'errorPayment',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async firstPayment(payload: TReqFirstPayment) {
        try {
            // firstPayment - PT / EN - Boa Vindas Primeiro Pagamento(Reserva) - Slide 3
            const mailbox: TMailAws = {
                template: 'firstPayment',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async forgotPassport(payload: TReqForgotPassport) {
        try {
            // ForgotPassport - PT/ EN -  Alteração de senha - slide 2
            const mailbox: TMailAws = {
                template: 'forgotPassport',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async invoiceAvailable(payload: TReqInvoiceAvailable) {
        try {
            // invoiceAvailable - PT/ EN - Pagamento LINK externo (já recebeu email de boas vindas)Slide 5
            const mailbox: TMailAws = {
                template: 'invoiceAvailable',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async linkPayment(payload: TReqLinkPayment) {
        try {
            // LinkPayment - PT/ EN - Pagamento LINK externo - Slide 4
            const mailbox: TMailAws = {
                template: 'linkPayment',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async paymentNew(payload: TReqPaymentNew) {
        try {
            const mailbox: TMailAws = {
                template: 'paymentNew',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async paymentReject(payload: TReqPaymentReject) {
        try {
            // PaymentReject - PT/ EN - Pagamento n realizado - Slide 7
            const mailbox: TMailAws = {
                template: 'paymentReject',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async paymentSuccess(payload: TReqPaymentSuccess) {
        try {
            // PaymentSuccess - PT / EN - Pagamento Confirmado - Slide 6
            const mailbox: TMailAws = {
                template: 'paymentSuccess',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async welcome(payload: TReqWelcome) {
        try {
            // Welcome - PT / EN - Boa Vinda APP - Slide 1
            const mailbox: TMailAws = {
                template: 'welcome',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }

    public async welcomeUser(payload: TReqWelcomeUser) {
        try {
            // WelcomeUser - Boas Vinda BO - Slide 9
            const mailbox: TMailAws = {
                template: 'welcomeUser',
                ...payload,
            };

            const resSendMail = await this.sendMailAWS(mailbox);
            return resSendMail;
        } catch (error: any) {
            console.log('MailAwsGateway.sendMailAWS.Axios.catch :: ', error);
            return {
                err: true,
                data: { error, message: 'Unexpect Error' },
            };
        }
    }
}
