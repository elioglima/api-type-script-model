import { Request, Response } from 'express';

import service from '../../service/index';
import camelcaseKeys from 'camelcase-keys';

export class PaymentResponsibleController {
    private ResponsiblePaymentService = new service.ResponsiblePaymentService();

    public findByResponsiblePayment = async (req: Request, res: Response) => {
        const dataRequest: {
            userId?: number;
        } = camelcaseKeys(req?.params);

        const data: any = await this.ResponsiblePaymentService.FindOneByUserId(
            Number(dataRequest.userId),
        );

        if (data instanceof Error) {
            return res.status(422).json({ ['Error']: data?.message });
        } else if (data.err) {
            return res.status(422).json({
                ['Error']:
                    data?.message ||
                    'message not defined when verifying payment responsible',
            });
        }

        return res.status(200).json(data);
    };
}
