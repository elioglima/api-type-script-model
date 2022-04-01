import { PaymentRecurrenceRepository } from './../../../../dataProvider/repository/PaymentRecurrenceRepository';
import { PaymentCards } from './../../../../domain/Payment/PaymentCards';
import { EnumBrands } from '../../../../enum/BrandsEnum';
import { EnumTopicStatusInvoice } from '../../../../domain/Tegrus/TStatusInvoice';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
import CardAddService from '../../../../service/CardAddService';
import CryptIntegrationGateway from '../../../../dataProvider/gateway/CryptIntegrationGateway';

export type TReq = {
    hash: string;
    card: {
        cardNumber: string;
        brand: EnumBrands;
        customerName: string;
        expirationDate: string;
        holder: string;
        securityCode: number;
    };
};

const returnTopic = (
    response: {
        invoiceId: number;
        paymentDate: Date | any;
        statusInvoice: EnumTopicStatusInvoice;
        paymentMethod: EnumInvoicePaymentMethod;
        type: EnumInvoiceType;
        message: string;
    },
    err: boolean = false,
) => {
    return {
        statusInvoice: {
            invoices: [
                {
                    invoiceId: 125,
                    messageError: err
                        ? response?.message || 'unexpected error'
                        : undefined,
                },
            ],
        },
    };
};

export const payNowCredit = async (
    payload: TReq,
    invoice: TInvoice,
    resident: TResident,
) => {
    try {
        const cardAddService = new CardAddService();
        const cryptIntegrationGateway = new CryptIntegrationGateway();
        const paymentRecurrenceRepository = new PaymentRecurrenceRepository();

        const hashC = await cryptIntegrationGateway.encryptData(
            payload.card.cardNumber,
        );
        const resPaymentCard: PaymentCards = {
            cardNumber: payload.card.cardNumber,
            brand: EnumBrands[payload.card.brand],
            customerName: payload.card.customerName,
            expirationDate: payload.card.expirationDate,
            holder: payload.card.holder,
            hash: String(payload.card.securityCode),
            hashC,
        };

        const resCardAdd = await cardAddService.execute(resPaymentCard);

        if (resCardAdd.err) return resCardAdd;

        const resRecurrence: any = paymentRecurrenceRepository.getByPreUserId(
            resident.id,
        );

        if (resRecurrence instanceof Error)
            return { err: true, data: { message: 'Error to find recurrence' } };

        if (resRecurrence) {
            const resRecuUpdate = paymentRecurrenceRepository.update({
                ...resRecurrence,
                updatedAt: new Date(),
                active: false,
            });
            if (resRecuUpdate instanceof Error)
                return {
                    err: true,
                    data: { message: 'Error to find recurrence' },
                };
        }

        /* 
            - verificar se ha recorrencia vigente
                - caso tenha cancelar a recorrencia e efetuar o pagamento

            - efetuar pagamento pelo adapter
            - atualizar a fatura
                - status
                - dados de cartao
        */
        console.log({ payload, invoice, resident });

        const paymentDate: Date = new Date(); // so de exemplo
        const newStatusInvoice = EnumTopicStatusInvoice.paid; // so de exemplo

        return returnTopic({
            invoiceId: invoice.invoiceId,
            paymentDate,
            statusInvoice: newStatusInvoice,
            paymentMethod: invoice.paymentMethod,
            type: invoice.type,
            message: 'recurrence started successfully',
        });
    } catch (error: any) {
        return returnTopic(
            {
                invoiceId: invoice.invoiceId,
                paymentDate: null,
                statusInvoice: invoice.statusInvoice,
                paymentMethod: invoice.paymentMethod,
                type: invoice.type,
                message: error?.message,
            },
            true,
        );
    }
};
