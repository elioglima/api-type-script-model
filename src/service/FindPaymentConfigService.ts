import debug from 'debug';
import { PaymentConfigRepository } from '../dataProvider/repository/PaymentConfigRepository';
import CryptIntegrationGateway from '../dataProvider/gateway/CryptIntegrationGateway';

export class FindPaymentConfigService {
    private logger = debug('payment-api:FindPaymentConfigService');
    private paymentConfigRepository = new PaymentConfigRepository();
    private cryptIntegrationGateway = new CryptIntegrationGateway();

    public execute = async (enterpriseId: number) => {
        this.logger(`Find payment config by enterpriseId`, { enterpriseId });
        const response = await this.paymentConfigRepository
            .getByEnterpriseId(enterpriseId)
            .then(
                async data => {
                    if (data === undefined) {
                        this.logger(`Payment config ${enterpriseId} not found`);
                        return new Error(
                            `Payment config ${enterpriseId} not found`,
                        );
                    }

                    data.merchantId =
                        await this.cryptIntegrationGateway.decryptData(
                            `${data.merchantId}`,
                        );
                    data.merchantKey =
                        await this.cryptIntegrationGateway.decryptData(
                            `${data.merchantKey}`,
                        );


                    this.logger(`${data}`);
                    return data;
                },
                (err: string | undefined) => {                    
                    this.logger(`Error: ${err}`);
                    return new Error(err);
                },
            );
        
        return response
    };
}
