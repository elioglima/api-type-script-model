import { Request, Response } from 'express';
import * as md from './modules';

import { CreatePaymentConfigService } from '../../service/CreatePaymentConfigService';
import { PaymentConfig } from '../../domain/Payment/PaymentConfig';

export class TegrusController {
    public payConfig = async (res: Response) => {
        const rows = [
            {
                enterpriseId: 2,
                merchantId: '96dfdd4d-2782-4c09-a2f7-40668a1e7317',
                merchantKey: 'ev2hiHEneK8VWQ5KQlg2Ddbb8fBXLXORDlmimNWh',
            },
            {
                enterpriseId: 0,
                merchantId: '33975d21-6678-43ce-b1e9-c404a67ce7a5',
                merchantKey: '5RUlEI3gFmW2sXEcOL0QDZohiYfLKt1vrEkj9gQZ',
            },
            {
                enterpriseId: 1,
                merchantId: 'e5353146-563d-4909-be10-3ef3967135d4',
                merchantKey: 'l6gPX9IbghbRh9jiDxFafE37tzglQgLiOwabwEpK',
            },
            {
                enterpriseId: 3,
                merchantId: 'f01a6958-38e6-4fa8-ba06-ec020833b663',
                merchantKey: 'yeerowsiHvBvN8W4kFq1gg6cflH82SpYbjWirPZb',
            },
        ];

        const paymentConfigService = new CreatePaymentConfigService();

        const response = await rows.map(async (r, i) => {
            const data: PaymentConfig = {
                id: i,
                enterpriseId: r.enterpriseId,
                merchantId: r.merchantId,
                merchantKey: r.merchantKey,
                createdAt: new Date(),
                updatedAt: new Date(),
                provider: '',
                hostnameTransacao: '',
                hostnameQuery: '',
            };
            return await paymentConfigService.execute(data);
        });

        return res.status(200).json(response);
    };

    public gatewayPaynow = async (req: Request, res: Response) => {
        return await md.gatewayPaynow(req, res);
    };

    public invoiceEngine = async (req: Request, res: Response) => {
        return await md.invoiceEngine(req, res);
    };

    public invoiceEnginePrivate = async (req: Request, res: Response) => {
        console.log(req.body);
        return await md.invoiceEnginePrivate(res);
    };

    public hashSearch = async (req: Request, res: Response) => {
        return await md.hashSearch(req, res);
    };
}
