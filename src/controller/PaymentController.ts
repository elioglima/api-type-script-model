import debug from 'debug';
import { Request, Response } from 'express';

import service from '../service/index';
import { UpdateByGatewayIdService } from '../service/UpdateByGatewayIdService';
import { FindPaymentByGatewayIdService } from '../service/FindPaymentByGatewayIdService';
import { CreatePaymentConfigService } from '../service/CreatePaymentConfigService';
import { FindAllPaymentService } from '../service/FindAllPaymentService';
import { UpdatePaymentCardService } from '../service/UpdatePaymentCardService';
import { InactivatePaymentCardService } from '../service/InactivatePaymentCardService';

export class PaymentController {
    private logger = debug('payment-api:PaymentController');

    private MakePaymentService = new service.MakePaymentService();
    private ReceiptIdService = new service.ReceiptIdService();
    private CardListByFilterService = new service.CardListByFilterService();
    private CardAddService = new service.CardAddService();
    private CardRemoveService = new service.CardRemoveService();

    private updateByGatewayIdService = new UpdateByGatewayIdService();
    private findPaymentByGatewayIdService = new FindPaymentByGatewayIdService();
    private createPaymentConfigService = new CreatePaymentConfigService();
    private findAllPaymentService = new FindAllPaymentService();
    private updatePaymentCardService = new UpdatePaymentCardService();
    private inactivatePaymentCardService = new InactivatePaymentCardService();

    public MakePayment = async (req: Request, res: Response) => {
        this.logger(`Creating payment`, req.body);

        const data = await this.MakePaymentService.execute(req.body);

        if (data instanceof Error) {
            this.logger('Error', data.message);
            return res.status(422).json({ ['Error']: data.message });
        }

        return res.status(200).json(data);
    };

    public getReceipt = async (req: Request, res: Response) => {
        this.logger(`getReceipt`);

        const data = await this.ReceiptIdService.execute(
            Number(req.params.userId),
            req.query.idTransaction
                ? String(req.query.idTransaction)
                : undefined,
            req.query.daysFilter ? Number(req.query.daysFilter) : undefined,
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

    public CardAdd = async (req: Request, res: Response) => {
        this.logger(`CardAdd`);

        const data = await this.CardAddService.execute(req.body);

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

    public getByGatewayId = async (req: Request, res: Response) => {
        this.logger(`Find payment by id ${req.params.id}`);

        const data = await this.findPaymentByGatewayIdService.execute(
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
}
