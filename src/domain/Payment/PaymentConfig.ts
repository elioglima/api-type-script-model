export interface PaymentConfig{
  id: number;
  enterpriseId: number;
  merchantId: string;
  merchantKey: string;
  provider: string;
  hostnameTransacao: string;
  hostnameQuery: string;
  createdAt: Date;
  updatedAt: Date;
}