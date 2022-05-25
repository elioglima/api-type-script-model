import deactivateRecurrence from '../../../../service/tegrus.services/disableRecurrence';
import ResidentService from '../../../../service/residentService';
import InvoiceService from '../../../../service/invoiceService';
import CancelContractService from '../../../../service/CancelContractService';
import moment from 'moment';

type TContractCancel = {
    contractCancel: {
        residentId: number;
        description: string;
        unitId: number;
        entrepriseId: number;
        finishDate: Date; //timestamp;
    };
};

const contractCancel = async (req: any) => {
    const payload: TContractCancel = req;

    const returnTopic = (response: any, err: boolean = false) => {
        const { message, ...res } = response;
        return {
            status: err ? 422 : 200,
            err,
            contractCancel: {
                ...(payload?.contractCancel ? payload?.contractCancel : {}),
                returnOpah: {
                    ...(res ? res : {}),
                    ...(err ? { messageError: response.message } : {}),
                },
            },
        };
    };

    try {
        console.log('contractCancel ::', payload);
        const residentId = payload.contractCancel.residentId;
        const residentService = new ResidentService();
        const resResident = await residentService.FindOne(residentId);

        if (resResident?.err)
            return returnTopic({ message: 'resident not located' }, true);

        const cancelContractService = new CancelContractService();
        const resUserCancel = await cancelContractService.execute(
            payload.contractCancel.residentId,
            moment(payload.contractCancel.finishDate).toDate(),
        );

        if (resUserCancel?.err) {
            return returnTopic({ message: 'resident not located' }, true);
        }

        console.log(123, resUserCancel);

        const invoiceService = new InvoiceService();
        const resInvoice = await invoiceService.FindOneResidentId(residentId);

        if (resInvoice?.err)
            return returnTopic({ message: 'resident not located' }, true);

        const invoices: any[] = resInvoice.data;
        const ResultDisableRecurrence: any[] = await Promise.all(
            invoices.map(async () => {
                try {
                    await deactivateRecurrence(residentId);
                    return {
                        err: false,
                        data: {
                            message: `successful cancellation`,
                        },
                    };
                } catch (error: any) {
                    return {
                        err: true,
                        data: {
                            message: error.message || 'unexpected error',
                        },
                    };
                }
            }),
        );

        const isError: boolean =
            ResultDisableRecurrence.filter((f: any) => f?.err).length > 0;

        return returnTopic(
            {
                resident: resResident.data,
                message: isError
                    ? 'failed cancellation'
                    : 'successful cancellation',
            },
            isError,
        );
    } catch (error: any) {
        return returnTopic(
            { message: error?.message || 'Erro inesperado' },
            true,
        );
    }
};

export { contractCancel };
