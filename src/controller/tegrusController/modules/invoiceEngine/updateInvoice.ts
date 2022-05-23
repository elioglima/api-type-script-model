import InvoiceService from '../../../../service/invoiceService';
import createHash from './createHash';
import firstPaymentCreateService from '../../../../service/tegrus.services/firstPaymentCreateService';

const updateInvoice = async (toReceive: any) => {
    try {
        // retorno do app >> bff >> tegrus
        const updataData: any = {
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

        console.log(777, invoice);
        await invoiceService.Update(updataData);
        if (updataData.isExpired) {
            // TO-DO-NOW
            // verificar a recorrencia
            // desativar a recorrencia do mes atual da fatura alterada

            const linkInvoice: any = await createHash(
                toReceive?.updateInvoice?.invoiceId,
            );

            if (linkInvoice.err) {
                return {
                    err: true,
                    data: {
                        updateInvoice: {
                            ...toReceive?.updateInvoice,
                            returnOpah: {
                                messageMessage: 'Error generating link',
                            },
                        },
                    },
                };
            }

            return {
                err: false,
                data: {
                    updateInvoice: {
                        ...toReceive?.updateInvoice,
                        returnOpah: {
                            message: 'success',
                            linkInvoice,
                        },
                    },
                },
            };
        }

        // retorno apenas de um update
        return {
            err: false,
            data: {
                updateInvoice: {
                    ...toReceive?.updateInvoice,
                    returnOpah: {
                        message: 'success',
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
