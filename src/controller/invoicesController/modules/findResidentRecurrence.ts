import { Request, Response } from 'express';
import { FindResidentRecurrenceService } from '../../../service/FindResidentRecurrenceService';


export const findResidentRecurrence = async (req: Request, res: Response) => {
    try {

        const findResidentRecurrenceService = new FindResidentRecurrenceService();
        const response = await findResidentRecurrenceService.execute(Number(req.params.id));
        if (response.err) {
            return res.status(422).json(response);
        }

        return res.status(200).json({
            err: false,
            data: response,
        });
    } catch (error) {
        console.log(error);
        return res.status(422).json(error);
    }
};
