import { TExternalPayment } from '../../../../domain/Tegrus/TExternalPayment';
import InvoiceService from '../../../../service/invoiceService';
import { TInvoice } from '../../../../domain/Tegrus/TInvoice';
import RecurrenceService from '../../../../service/recurrenceService';
import { invoiceToTResident } from '../../../../utils';
import { TResident, EnumInvoiceStatus } from '../../../../domain/Tegrus/';

const externalPayment = async (req: any) => {
    const payload: TExternalPayment = req?.externalPayment;

    const returnTopic = (
        response: any,
        err: boolean = false,
        message: string = 'Success',
    ) => {
        return {
            status: err ? 422 : 200,
            err,
            ...(message ? { message } : {}),
            data: {
                externalPayment: {
                    ...(payload ? { ...payload } : {}),
                    returnOpah: {
                        err,
                        status: err ? 'failed' : 'success',
                        ...(err
                            ? { messageError: message || undefined }
                            : { message }),
                        ...(response ? { ...response } : {}),
                    },
                },
            },
        };
    };

    try {
        const invoiceService = new InvoiceService();
        let resFindOne: any = await invoiceService.FindOne(payload.invoiceId);
        if (resFindOne.err)
            return returnTopic(
                {
                    messageError: resFindOne?.data?.message,
                },
                true,
            );

        let invoice: TInvoice = resFindOne.data;
        if (invoice.statusInvoice == EnumInvoiceStatus.issued) {
            const updataData: any = {
                invoiceId: invoice?.invoiceId,
                paymentDate: payload?.paidAt,
                paymentMethod: payload?.paymentMethod,
                statusInvoice: payload?.statusInvoice,
            };

            if (invoice.isRecurrence) {
                const converRes: TResident | any = invoiceToTResident(
                    invoice?.residentIdenty,
                );
                const recurrenceService = new RecurrenceService();
                await recurrenceService.DisableRecurrence(converRes);
            }

            const resUpdateIvoice = await invoiceService.Update(updataData);
            const resFindOne2: any = await invoiceService.FindOne(
                payload.invoiceId,
            );
            invoice = resFindOne2?.data;

            if (resUpdateIvoice.err)
                return returnTopic(
                    {
                        message: 'invoice updated successfully',
                    },
                    true,
                );
        }

        return returnTopic({
            message: 'invoice processed',
            invoice,
        });
    } catch (error: any) {
        console.log(error);
        return returnTopic({}, true, error?.message || 'Erro inesperado');
    }
};

export { externalPayment };
