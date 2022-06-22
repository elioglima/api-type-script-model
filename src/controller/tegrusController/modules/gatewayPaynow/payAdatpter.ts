import { TInvoice } from './../../../../domain/Tegrus/TInvoice';
import { TResident } from '../../../../domain/Tegrus';
import { reqCardAdd, reqMakePayment } from '../../../../domain/IAdapter';
import AdapterPayment from '../../../../domain/AdapterPayment';
import service from '../../../../service/index';
import { PaymentCards } from '../../../../domain/Payment';
import { rError, rSuccess } from '../../../../utils';
import { EnumCardType } from '../../../../enum';
import moment from 'moment';

export const payAdatpter = async (
    resident: TResident,
    card: reqCardAdd,
    invoice?: TInvoice,
    isPayment: boolean = false,
) => {
    try {
        const adapter = new AdapterPayment();
        const cardAddService = new service.CardAddService();

        if (!resident?.enterpriseId)
            return rError({ message: 'business code not informed' });

        await adapter.init(resident.enterpriseId);
        if (!resident?.id) return rError({ message: 'residentId not found' });

        const securityCode: number | string | undefined =
            card.hash || card.securityCode;

        if (!securityCode || Number(securityCode) <= 0)
            return rError({ message: 'security code not informed' });

        const requestCardAdd: PaymentCards = {
            enterpriseId: resident.enterpriseId,
            residentId: resident.id,
            brand: card.brand,
            cardNumber: card.cardNumber,
            customerName: card.customerName,
            expirationDate: card.expirationDate,
            holder: card.holder,
            hash: String(securityCode),
            securityCode: Number(securityCode),
        };

        const resCard: any = await cardAddService.execute(requestCardAdd);
        if (resCard?.err) return rError(resCard?.data || resCard);
        if (resCard?.abortProcess) return rError(resCard?.data || resCard);

        if (isPayment) {
            const reqPayment: reqMakePayment = {
                merchantOrderId: invoice?.invoiceId
                    .toString()
                    .concat(
                        moment()
                            .format('YYYYMMDDHH:mm')
                            .concat(card?.cardNumber.slice(-4)),
                    ),
                customer: {
                    name: resident?.name,
                    email: resident?.email,
                    phone: resident?.smartphone,
                },
                payment: {
                    type: EnumCardType.CREDIT,
                    amount: Number(invoice?.totalValue),
                    installments: 1,
                    softDescriptor: 'Pagamento Credito',
                    creditCard: {
                        cardNumber: card?.cardNumber,
                        holder: card?.holder,
                        expirationDate: card?.expirationDate,
                        customerName: card?.customerName,
                        brand: card?.brand,
                        securityCode: String(card?.securityCode),
                        cardToken: resCard?.data?.card?.token,
                    },
                },
            };

            const resPayment: any = await adapter.makePayment(reqPayment);
            console.log(777777, resPayment);

            if (resPayment instanceof Error)
                return rError({ message: 'Error to pay' });

            return rSuccess(resPayment);
        }

        return rSuccess(resCard);
    } catch (error) {
        console.log(999, error);
    }
};
