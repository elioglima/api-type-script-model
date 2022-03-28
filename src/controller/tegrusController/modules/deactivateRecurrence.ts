import { Request, Response } from 'express';
import { TErrorGeneric } from '../../../domain/Generics';
import deactivateRecurrenceService from '../../../service/tegrus.services/deactivateRecurrence'


type resDeactivateRecurrence = {};


const deactivateRecurrence = async (
    req: Request,
    res: Response,
) => {
    try {
        const recurrenceId = req?.params?.recurrenceId;        
        const statusRecurrence = await deactivateRecurrenceService(recurrenceId)

        return res.status(200).json(statusRecurrence);
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { deactivateRecurrence  };
