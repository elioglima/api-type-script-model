import { TInvoice, TLinkInvoice } from '../../../../../domain/Tegrus/TInvoice';
import InvoiceService from '../../../../../service/invoiceService';
import PreRegisterResidentService from '../../../../../service/tegrus.services/PreRegisterService';
import createHash from './createHash';
import { returnTopic } from './returnTopic';
import { PaymentRecurrenceRepository } from '../../../../../dataProvider/repository/PaymentRecurrenceRepository';


const invoicing = async (payload: TInvoice) => {
    const linkInvoice: TLinkInvoice = await createHash(
        Number(payload.invoiceId),
    );
    const paymentRecurrenceRepository = new PaymentRecurrenceRepository();

    try {
        console.log('invoicing', payload);
        const invoiceService = new InvoiceService();
        const resFindOneInclude = await invoiceService.FindOne(
            payload.invoiceId,
        );
        if (payload?.resident)
            returnTopic(payload, { message: 'Resident was not informed' }, true);

        if (resFindOneInclude.err) {
            // consultar residente
            const preRegisterResidentService = new PreRegisterResidentService();
            const resPreRegisterResidentServiceFindOne =
                await preRegisterResidentService.getById(
                    Number(payload?.resident?.id),
                );

            const isResidentExist = !!resPreRegisterResidentServiceFindOne.err;
            let isRecurrenceCreated:any = null;

            if (isResidentExist == true) {
                // verificar se existe uma recorrencia criada
                isRecurrenceCreated = await paymentRecurrenceRepository.getByPreUserId(resPreRegisterResidentServiceFindOne.id)
                
                if (
                    isResidentExist &&
                    isRecurrenceCreated &&
                    payload.isRecurrence == true
                ) {
                    return returnTopic(
                        payload,
                        { message: 'recurrence is already active' },
                        true,
                    );
                }
            }

            // cadastrar fatura

            if (isResidentExist && isRecurrenceCreated) {
                // verificar recorrencia na cielo se esta efetiva

                // caso a fatura estiver paga atualizar o status da fatura
                // statusInvoice.paid = 'paid',
                // consultar invoice atualizada e retornar no topco
                return returnTopic(
                    payload,
                    { message: 'recurrence is already active' },
                    false,
                );
            }

            linkInvoice;
            return returnTopic(
                payload,
                {
                    message: 'Invoice successfully added',
                },
                false,
                linkInvoice,
            );
        }

        // verificar se existe uma recorrencia criada
        const isRecurrenceCreated = true;

        if (isRecurrenceCreated && payload.isRecurrence == true) {
            return returnTopic(
                payload,
                { message: 'recurrence is already active' },
                true,
            );
        }

        // verificar recorrencia na cielo se esta efetiva

        // caso a fatura estiver paga atualizar o status da fatura
        // statusInvoice.paid = 'paid',
        // consultar invoice atualizada e retornar no topco
        return returnTopic(
            payload,
            { message: 'recurrence is already active' },
            false,
        );
    } catch (error: any) {
        console.log(error);
        return returnTopic(
            payload,
            { message: error?.message || 'unexpected error' },
            true,
        );
    }
};

export { invoicing };
