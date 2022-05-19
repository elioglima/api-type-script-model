// import { payNowPix } from './../tegrusController/modules/gatewayPaynow/payNowPix';
import debug from 'debug';
import { Request, Response } from 'express';

import service from '../../service/index';
import RecurrenceService from '../../service/recurrenceService';
import { UpdateByGatewayIdService } from '../../service/UpdateByGatewayIdService';
import { FindPaymentByIdService } from '../../service/FindPaymentByIdService';
import { CreatePaymentConfigService } from '../../service/CreatePaymentConfigService';
import { FindAllPaymentService } from '../../service/FindAllPaymentService';
import camelcaseKeys from 'camelcase-keys';
import { UpdatePaymentCardService } from '../../service/UpdatePaymentCardService';
import { InactivatePaymentCardService } from '../../service/InactivatePaymentCardService';
import { FindCardByIdService } from '../../service/FindCardByIdService';
import { PaymentCards } from '../../domain/Payment';
import { RecurrentModifyPaymentModel } from '../../domain/RecurrentPayment/recurrentModify';
import { FindReceiptByPaymentIdService } from '../../service/FindReceiptByPaymentIdService';
import PreRegisterService from '../../service/tegrus.services/PreRegisterService';

export class PaymentController {
    private logger = debug('payment-api:PaymentController');

    private ReceiptIdService = new service.ReceiptIdService();
    private CardListByFilterService = new service.CardListByFilterService();
    private CardAddService = new service.CardAddService();
    private CardRemoveService = new service.CardRemoveService();
    private refoundPaymentService = new service.RefoundPaymentService();
    private recurrenceService = new RecurrenceService();

    private updateByGatewayIdService = new UpdateByGatewayIdService();
    private findPaymentByIdService = new FindPaymentByIdService();
    private createPaymentConfigService = new CreatePaymentConfigService();
    private findAllPaymentService = new FindAllPaymentService();
    private updatePaymentCardService = new UpdatePaymentCardService();
    private inactivatePaymentCardService = new InactivatePaymentCardService();
    private findCardByIdService = new FindCardByIdService();
    private findReceiptByPaymentIdService = new FindReceiptByPaymentIdService();
    private preRegisterService = new PreRegisterService();

    public MakePayment = async (req: Request, res: Response) => {
        try {
            this.logger(`Creating payment`, req.body);
            const dataRequest = camelcaseKeys(req.body, { deep: true });
            const MakePaymentService = new service.MakePaymentService();
            const data = await MakePaymentService.execute(dataRequest);

            if (data instanceof Error) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            if (data.err) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            this.logger(`Creating payment`, error);
            return res.status(422).json(error);
        }
    };

    public RefoundPayment = async (req: Request, res: Response) => {
        try {
            this.logger(`Refound payment`, req.body);
            const data = await this.refoundPaymentService.execute(
                Number(req.params.id),
            );

            if (data instanceof Error) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            if (data.err) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            return res.status(200).json(data);
        } catch (error) {
            this.logger(`Error`, error);
            return res.status(422).json(error);
        }
    };

    public CardAdd = async (req: Request, res: Response) => {
        this.logger(`CardAdd`);
        const dataRequest: PaymentCards = camelcaseKeys(req.body);

        if (!dataRequest.userId) {
            const message = 'incomplete parameters';
            this.logger('Error', message);
            return res.status(422).json({ ['err']: message });
        }

        const response: any = await this.CardAddService.execute(dataRequest);

        if (response?.err == true) {
            return res.status(422).json(response?.data);
        }

        if (response instanceof Error) {
            return res.status(422).json(response);
        }

        return res.status(200).json(response.data);
    };

    public getReceipt = async (req: Request, res: Response) => {
        this.logger(`getReceipt`);
        const dataRequest: {
            paymentId?: string;
            daysFilter?: number;
        } = camelcaseKeys(req?.query);

        const data = await this.ReceiptIdService.execute(
            Number(req.params.userId),
            dataRequest?.paymentId,
            dataRequest?.daysFilter,
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public getAllPayments = async (_req: Request, res: Response) => {
        this.logger(`getAllPayments`);

        const data = await this.findAllPaymentService.execute();

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public UserCardListByFilter = async (req: Request, res: Response) => {
        this.logger(`CardListByFilter`);

        const data = await this.CardListByFilterService.execute(
            Number(req.params.userId),
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public findCardById = async (req: Request, res: Response) => {
        this.logger(`findCardById`);

        const data = await this.findCardByIdService.execute(
            Number(req.params.id),
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public CardRemove = async (req: Request, res: Response) => {
        this.logger(`CardRemove`);

        const data = await this.CardRemoveService.execute(
            Number(req.params.id),
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public getById = async (req: Request, res: Response) => {
        this.logger(`Find payment by id ${req.params.id}`);

        const data = await this.findPaymentByIdService.execute(
            Number(req.params.id),
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public update = async (req: Request, res: Response) => {
        this.logger(`Update payment`, req.body);

        const data = await this.updateByGatewayIdService.execute(req.body);

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public createPaymentconfig = async (req: Request, res: Response) => {
        this.logger(`Creating payment`, req.body);

        const data = await this.createPaymentConfigService.execute(req.body);

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public updateCard = async (req: Request, res: Response) => {
        this.logger(`updating card`, req.body);

        const data = await this.updatePaymentCardService.execute(req.body);

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public inactivateUserCards = async (req: Request, res: Response) => {
        this.logger(`updating card`, req.body);

        const data = await this.inactivatePaymentCardService.execute(
            Number(req.params.userId),
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public makePix = async (req: Request, res: Response) => {
        try {
            this.logger(`Creating payment`, req.body);
            const dataRequest = camelcaseKeys(req.body, { deep: true });
            const MakePixService = new service.MakePixService();
            const data = await MakePixService.execute(dataRequest);

            if (data instanceof Error) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            if (data.err) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            this.logger(`Creating payment`, error);
            return res.status(422).json(error);
        }
    };

    public getReceiptPix = async (req: Request, res: Response) => {
        try {
            this.logger(`Creating payment`, req.body);
            const dataRequest = req.params.merchantOrderId;
            const MakePixService = new service.MakePixService();
            const data = await MakePixService.getPixReceipt(dataRequest);

            if (data instanceof Error) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            if (data.err) {
                this.logger('Error', data.message);
                return res.status(422).json(data.message);
            }

            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            this.logger(`Creating payment`, error);
            return res.status(422).json(error);
        }
    };

    public RefundRecurrencePayment = async (req: Request, res: Response) => {
        try {
            this.logger(`Refound payment`, req.body);
            const { invoiceId, comments } = req.body;
            const data: any = await this.recurrenceService.RefundRecurrence(
                invoiceId,
                comments,
            );

            if (data instanceof Error) {
                this.logger('Error', data?.message);
                return res.status(422).json(data.message);
            }

            if (data.err) {
                this.logger('Error', data?.message);
                return res.status(422).json(data?.data?.message);
            }

            console.log(444, data);
            return res.status(200).json(data);
        } catch (error) {
            this.logger(`Error`, error);
            return res.status(422).json(error);
        }
    };

    public changeCard = async (req: Request, res: Response) => {
        try {
            this.logger(`Change payment credit Card`, req.body);
            const invoiceId = req.params.invoiceId;
            const body = req.body;

            /*
                {
                    Brand: string;
                    Holder: string;
                    CardNumber: string;
                    ExpirationDate: string;
                }
            */
            const reqModify: RecurrentModifyPaymentModel = {
                invoiceId: Number(invoiceId),
                payment: {
                    Type: 'CreditCard',
                    CreditCard: body,
                },
            };

            const data: any = await this.recurrenceService.changeCardRecurrence(
                reqModify,
            );

            if (data instanceof Error) {
                this.logger('Error', data?.message);
                return res.status(422).json(data.message);
            }

            if (data.err) {
                this.logger('Error', data?.message);
                return res.status(422).json(data?.data?.message);
            }

            return res.status(200).json(data);
        } catch (error) {
            this.logger(`Error`, error);
            return res.status(422).json(error);
        }
    };

    public getReceiptByPaymentId = async (req: Request, res: Response) => {
        this.logger(`getReceiptByPaymentId ${req.params.id}`);

        const data = await this.findReceiptByPaymentIdService.execute(
            Number(req.params.id),
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public getPreRegisterUserData = async (req: Request, res: Response) => {
        this.logger(`getReceiptByPaymentId ${req.params.id}`);

        const data = await this.preRegisterService.getById(
            Number(req.params.id),
        );

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };
}
