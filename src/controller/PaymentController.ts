import debug from 'debug';
import { Request, Response } from 'express';

import service from '../service/index';
import { FindPaymentByIdService } from '../service/ReceiptIdService';
import { UpdateByGatewayIdService } from '../service/UpdateByGatewayIdService';
import { FindPaymentByGatewayIdService } from '../service/FindPaymentByGatewayIdService';

export class PaymentController {
    private logger = debug('payment-api:PaymentController');
    private MakePaymentService = new service.MakePaymentService();
    private ReceiptIdService = new service.ReceiptIdService();
    private updateByGatewayIdService = new UpdateByGatewayIdService();
    private findPaymentByGatewayIdService = new FindPaymentByGatewayIdService();

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

        const idTransaction: Number | any = req.params.idTransaction

        const data = await this.ReceiptIdService.execute(
            idTransaction
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
            req.params.id,
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
}
