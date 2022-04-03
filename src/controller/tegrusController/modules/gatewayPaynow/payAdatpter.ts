import { TResident } from '../../../../domain/Tegrus';
import { reqCardAdd } from '../../../../domain/IAdapter';
import AdapterPayment from '../../../../domain/AdapterPayment';
import service from '../../../../service/index';
import { PaymentCards } from '../../../../domain/Payment';
import { rError, rSuccess } from '../../../../utils';

export const payAdatpter = async (resident: TResident, card: reqCardAdd) => {
    try {
        const adapter = new AdapterPayment();
        const cardAddService = new service.CardAddService();

        await adapter.init(resident.enterpriseId);

        if (!resident?.enterpriseId)
            return rError({ message: 'business code not informed' });

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

        const data = await cardAddService.execute(requestCardAdd);
        if (data?.error) return rError(data);
        if (data?.abortProcess) return rError(data);

        return rSuccess(data);
    } catch (error) {
        console.log(error);
    }
};
