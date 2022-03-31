import InvoiceService from "src/service/invoiceService";

const updateInvoice = async (toReceive: any) => {
    try {
        // retorno do app >> bff >> tegrus
        const updataData :any = {
            value: toReceive?.updateInvoice?.value,
            condominium: toReceive?.updateInvoice?.condominium,
            discount: toReceive?.updateInvoice?.discount,
            tax: toReceive?.updateInvoice?.tax,
            refund: toReceive?.updateInvoice?.refund,
            fine: toReceive?.updateInvoice?.fine,
            fineTicket: toReceive?.updateInvoice?.fineTicket,
            dueDate: toReceive?.updateInvoice?.dueDate,
            description: toReceive?.updateInvoice?.description,
            anticipation: toReceive?.updateInvoice?.anticipation,
            type: toReceive?.updateInvoice?.type,
            paymentMethod: toReceive?.updateInvoice?.paymentMethod,
            statusInvoice: toReceive?.updateInvoice?.statusInvoice,
            apartmentId: toReceive?.updateInvoice?.apartmentId,
            invoiceId: toReceive?.updateInvoice?.invoiceId,
        };

        const invoiceService = new InvoiceService();
        await invoiceService.Update(updataData);

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
