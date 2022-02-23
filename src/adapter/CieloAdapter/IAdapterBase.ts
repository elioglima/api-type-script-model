import { IEnterprise, CieloTransactionInterface } from 'src/interface/cielo-transaction.interface';

export interface IAdapterBase {
    readonly API_URL: string | undefined;

    getEnterpriseData(params: IEnterprise): CieloTransactionInterface
}

