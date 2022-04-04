import { reqMakePayment } from './../../../../domain/IAdapter';
import { PaymentRecurrenceRepository } from './../../../../dataProvider/repository/PaymentRecurrenceRepository';
import { PaymentCards } from './../../../../domain/Payment/PaymentCards';
import { EnumBrands } from '../../../../enum/BrandsEnum';
import { EnumTopicStatusInvoice } from '../../../../domain/Tegrus/TStatusInvoice';
import { TInvoice, TResident } from '../../../../domain/Tegrus';
import { EnumInvoicePaymentMethod } from '../../../../domain/Tegrus/EnumInvoicePaymentMethod';
import { EnumInvoiceType } from '../../../../domain/Tegrus/EnumInvoiceType';
import { EnumCardType } from '../../../../enum';
import CardAddService from '../../../../service/CardAddService';
import CryptIntegrationGateway from '../../../../dataProvider/gateway/CryptIntegrationGateway';
import Adapter from '../../../../domain/Adapter';
import debug from 'debug';

import { TPayNowReq } from './TPayNow';

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
    payload: TPayNowReq,
    invoice: TInvoice,
    resident: TResident,
) => {
    try {
        //console.log("ASdfuyasgsgfioas", {payload,invoice,resident })
        const logger = debug('payment-api:PayNowCredit');
        const cardAddService = new CardAddService();
        const cryptIntegrationGateway = new CryptIntegrationGateway();
        const paymentRecurrenceRepository = new PaymentRecurrenceRepository();
        const adapter = new Adapter();

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
        
        const resCardAdd = await cardAddService.execute({...resPaymentCard, enterpriseId: resident.enterpriseId});              

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

        const reqPayment: reqMakePayment = {
            customer: {
                name: resident?.name,
                email: resident.email,
                birthdate: resident.birthDate,
                identity: resident.document,
                identityType: resident.documentType,
            },
            payment: {
                type: EnumCardType.CREDIT,
                amount: invoice?.value,
                installments: 1,
                softDescriptor: 'Recorrencia JFL',
                creditCard: {
                    cardNumber: payload?.card?.cardNumber,
                    holder: payload?.card?.holder,
                    expirationDate: payload?.card?.expirationDate,
                    customerName: payload?.card?.customerName,
                    brand: payload?.card?.brand,
                },
            },
        };

        console.log('resident', resident);

        await adapter.init(resident.enterpriseId);
        const resPayment = await adapter.makePayment(reqPayment);

        console.log("resp", resPayment)
        //if (resPayment instanceof Error) return;

        /* 
            - verificar se ha recorrencia vigente
                - caso tenha cancelar a recorrencia e efetuar o pagamento

            - efetuar pagamento pelo adapter
            - atualizar a fatura
                - status
                - dados de cartao
        */

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
