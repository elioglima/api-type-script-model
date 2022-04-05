import deactivateRecurrence from '../../../../service/tegrus.services/disableRecurrence';
import ResidentService from '../../../../service/residentService';
import InvoiceService from '../../../../service/invoiceService';

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
        return {
            status: err ? 422 : 200,
            err,
            contractCancel: {
                ...(payload ? { ...payload } : {}),
                returnOpah: {
                    ...(response ? response : {}),
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

        const invoiceService = new InvoiceService();
        const resInvoice = await invoiceService.FindOneResidentId(residentId);

        if (resInvoice?.err)
            return returnTopic({ message: 'resident not located' }, true);

        const invoices: any[] = resInvoice.data;
        const ResultDisableRecurrence: any[] = await Promise.all(
            invoices.map(async invoice => {
                try {
                    const resUpdate = await invoiceService.Update({
                        ...invoice,
                        statusInvoice: 'canceled',
                        active: false,
                    });

                    if (resUpdate?.err)
                        return {
                            err: true,
                            data: {
                                message: `failed to update billing : invoiceId=${invoice.invoiceId}`,
                            },
                        };

                    await deactivateRecurrence(residentId);

                    // if (resDisableRecurrence?.err) return resDisableRecurrence;

                    /* 
                        TO-DO
                        desativar usuario do app e backoffice
                    
                    */
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
