import { Request, Response } from 'express';
import { TInvoiceEngineReq } from '../../../../domain/Tegrus/TInvoiceEngine';

import { createInvoice } from './createInvoice';
import { deleteInvoice } from './deleteInvoice';
import { statusInvoice } from './statusInvoice';
import { updateInvoice } from './updateInvoice';
import { cancelContract } from './cancelContract';

const invoiceEngine = async (req: Request, res: Response) => {
    try {
        const toReceive: TInvoiceEngineReq = req?.body;

        if (toReceive?.createResident) {
            // Regra primeiro pagamento - area logada
            // Emissão de Fatura
            // Antecipação de Faturas
            const response: any = await createInvoice(toReceive);
            return res.status(response?.status || 422).json(response?.data);
        } else if (toReceive?.deleteInvoice) {
            // Remover de Fatura Emitida
            const response: any = await deleteInvoice(toReceive);
            return res.status(response?.status || 422).json(response?.data);
        } else if (toReceive?.statusInvoice) {
            // Atualizar Status da Fatura (Pagamento/Problemas no Pagamento)
            const response: any = await statusInvoice(toReceive);
            return res.status(response?.status || 422).json(response?.data);
        } else if (toReceive?.updateInvoice) {
            // Vide documentacao
            const response: any = await updateInvoice(toReceive);
            return res.status(response?.status || 422).json(response?.data);
        } else if (toReceive?.cancelContract) {
            // Cancelar Contrato
            const response: any = await cancelContract(toReceive);
            return res.status(response?.status || 422).json(response?.data);
        }

        return res.status(200).json({
            err: true,
            data: {
                message: 'no condition found',
            },
        });
    } catch (error: any) {
        return res.status(422).json({
            err: true,
            data: {
                message: error?.message || 'unexpected error',
            },
        });
    }
};

export { invoiceEngine };
