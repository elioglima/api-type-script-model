import { PaymentConfig } from '../../domain/Payment/PaymentConfig';
import { getConnection } from 'typeorm';
import { PaymentConfigEntity } from '../entity/PaymentConfigEntity';

export class PaymentConfigRepository {
    public persist = async (paymentConfig: PaymentConfig) =>
        await getConnection()
            .getRepository(PaymentConfigEntity)
            .createQueryBuilder('paymentConfig')
            .insert()
            .values([
                {
                    enterpriseId: paymentConfig.enterpriseId,
                    merchantId: paymentConfig.merchantId,
                    merchantKey: paymentConfig.merchantKey,
                    provider: paymentConfig.provider,
                    hostnameTransacao: paymentConfig.hostnameTransacao,
                    hostnameQuery: paymentConfig.hostnameQuery,
                },
            ])
            .execute()
            .then(
                response => {
                    paymentConfig.id = Number(response.identifiers[0].id);
                    return paymentConfig;
                },
                onRejected => {
                    return onRejected;
                },
            );

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PaymentConfigEntity)
            .createQueryBuilder('paymentConfig')
            .where('paymentConfig.id = :id', { id })
            .getOne();

    public getByEnterpriseId = async (enterpriseId: number) => {
        return await getConnection()
            .getRepository(PaymentConfigEntity)
            .createQueryBuilder('paymentConfig')
            .where('paymentConfig.enterpriseId = :enterpriseId', {
                enterpriseId,
            })
            .getOne();
    }
}
