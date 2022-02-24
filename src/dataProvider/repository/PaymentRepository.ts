import debug from 'debug';
import { Payment } from '../../domain/Payment/Payment';
import { getConnection } from 'typeorm';
import { PaymentEntity } from '../entity/PaymentEntity';

export class PaymentRepository {
    private logger = debug('service-api:PaymentRepository');

    public persist = async (payment: Payment) => {

        return await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .insert()
            .values([
                {
                    userId: payment.userId,
                    transactionId: payment.paymentId,
                    transactionMessage: payment.returnMessage,
                    transactionCode: payment.returnCode,
                    descriptionMessage: payment.returnMessage,
                    status: [4, 6].includes(Number(payment.returnCode)) ? 'PAGO' : 'ERRO',
                    value: Number(payment?.amount) > 0 ? payment.amount : 0,
                },
            ])
            .execute()
            .then(
                response => {
                    payment.id = Number(response.identifiers[0].id);
                    return payment;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    }

    public getById = async (id: number) =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .where('payment.id = :id', { id })
            .getOne();

    public getAll = async () =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .getMany();

    public getByTransactionId = async (transactionId: string) =>
        await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .where('payment.transactionId = :transactionId', { transactionId })
            .getOne();

    public getUserPayments = async (userId: number, daysFilter?: number) => {
        const query = getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .select([
                'payment.descriptionMessage,payment.status,payment.value,payment.id,DATE_FORMAT(payment.createdAt, "%d/%m/%Y") as day',
            ])
            .where('payment.userId = :userId', { userId });

        if (daysFilter) {
            query.andWhere(
                'payment.createdAt > (NOW() - INTERVAL :daysFilter DAY)',
                { daysFilter },
            );
        }

        return query.getRawMany();
    };

    public update = async (payment: Payment) => {
        return await getConnection()
            .getRepository(PaymentEntity)
            .createQueryBuilder('payment')
            .update()
            .set(payment)
            .where('id = :id', { id: payment.id })
            .execute()
            .then(
                () => {
                    return payment;
                },
                onRejected => {
                    this.logger('Error ', onRejected);
                    return onRejected;
                },
            );
    };
}


/*
    
    // exemplo de retorno da cielo

{
  userId: 10,
  serviceTaxAmount: 0,
  installments: 1,
  interest: 0,
  capture: true,
  authenticate: false,
  recurrent: false,
  creditCard: {
    cardNumber: '123412******1231',
    holder: 'Teste Holder',
    expirationDate: '12/2030',
    saveCard: false,
    brand: 'Visa',
    cardOnFile: { usage: 'Used', reason: 'Unscheduled' }
  },
  tid: '0223053908253',
  proofOfSale: '279194',
  authorizationCode: '753200',
  softDescriptor: '123456789ABCD',
  provider: 'Simulado',
  isQrCode: false,
  amount: 15700,
  receivedDate: '2022-02-23 17:39:08',
  capturedAmount: 15700,
  capturedDate: '2022-02-23 17:39:08',
  status: 2,
  isSplitted: false,
  returnMessage: 'Operation Successful',
  returnCode: '6',
  paymentId: '8265633c-e591-4703-abb0-66ef1b12c7e8',
  type: 'CreditCard',
  currency: 'BRL',
  country: 'BRA',
  airlineData: { ticketNumber: 'AR988983' },
  links: [
    {
      method: 'GET',
      rel: 'self',
      href: 'https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/8265633c-e591-4703-abb0-66ef1b12c7e8'
    },
    {
      method: 'PUT',
      rel: 'void',
      href: 'https://apisandbox.cieloecommerce.cielo.com.br/1/sales/8265633c-e591-4703-abb0-66ef1b12c7e8/void'
    }
  ],
  isCryptoCurrencyNegotiation: true
}


*/