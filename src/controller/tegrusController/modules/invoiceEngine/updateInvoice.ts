import moment from 'moment';

import InvoiceService from '../../../../service/invoiceService';
import firstPaymentCreateService from '../../../../service/tegrus.services/firstPaymentCreateService';
import { EnumInvoiceStatus } from '../../../../domain/Tegrus';

const updateInvoice = async (toReceive: any) => {
    try {
        // retorno do app >> bff >> tegrus
        let updataData: any = {
            invoiceId: toReceive?.updateInvoice?.invoiceId,
            value: toReceive?.updateInvoice?.value,
            totalValue: toReceive?.updateInvoice?.totalValue,
            condominium: toReceive?.updateInvoice?.condominium,
            discount: toReceive?.updateInvoice?.discount,
            tax: toReceive?.updateInvoice?.tax,
            refund: toReceive?.updateInvoice?.refund,
            fine: toReceive?.updateInvoice?.fine,
            fineTicket: toReceive?.updateInvoice?.fineTicket,
            dueDate: toReceive?.updateInvoice?.dueDate,
            description: toReceive?.updateInvoice?.description,
            recurrenceDate: toReceive?.updateInvoice?.recurrenceDate,
            anticipation: toReceive?.updateInvoice?.anticipation,
            type: toReceive?.updateInvoice?.type,
            paymentMethod: toReceive?.updateInvoice?.paymentMethod,
            statusInvoice: toReceive?.updateInvoice?.statusInvoice,
            apartmentId: toReceive?.updateInvoice?.apartmentId,
            isExpired: toReceive?.updateInvoice?.isExpired,
            startReferenceDate: toReceive?.updateInvoice?.startReferenceDate,
            endReferenceDate: toReceive?.updateInvoice?.endReferenceDate,
        };

        const invoiceService = new InvoiceService();

        console.log(toReceive?.updateInvoice);
        const invoice = await invoiceService.FindOne(
            toReceive?.updateInvoice.invoiceId,
        );
        if (!invoice?.data) {
            await firstPaymentCreateService(toReceive?.updateInvoice);
        }

        const timeNow: Date = moment().toDate();
        if (moment(updataData.dueDate).add('days', 1).isBefore(timeNow)) {
            updataData.isExpired = true;
            updataData.statusInvoice = EnumInvoiceStatus.expired;
        }

        await invoiceService.Update(updataData);

        // retorno apenas de um update
        return {
            err: false,
            data: {
                updateInvoice: {
                    ...toReceive?.updateInvoice,
                    returnOpah: {
                        message: !updataData.expired
                            ? 'success'
                            : 'Invoice status changed to expired, due date expired.',
                    },
                },
            },
        };
    } catch (error: any) {
        return {
            err: true,
            data: {
                message: error?.message || 'Erro inesperado',
            },
        };
    }
};

export { updateInvoice };
