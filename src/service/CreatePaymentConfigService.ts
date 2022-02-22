import debug from 'debug';
import CryptIntegrationGateway from '../dataProvider/gateway/CryptIntegrationGateway';
import { PaymentConfig } from '../domain/Payment/PaymentConfig';
import { PaymentConfigRepository } from '../dataProvider/repository/PaymentConfigRepository';

export class CreatePaymentConfigService {
    private paymentConfigRepository = new PaymentConfigRepository();
    private cryptIntegrationGateway = new CryptIntegrationGateway();
    private logger = debug('user-api:CreatePaymentConfigService');

    public async execute(paymentConfig: PaymentConfig) {
        this.logger('Started create payment config\n', paymentConfig);

        paymentConfig.merchantId =
            await this.cryptIntegrationGateway.encryptData(
                paymentConfig.merchantId,
            );

        paymentConfig.merchantKey =
            await this.cryptIntegrationGateway.encryptData(
                paymentConfig.merchantKey,
            );

        return await this.paymentConfigRepository
            .persist(paymentConfig)
            .then(hasPersist => hasPersist);
    }
}
