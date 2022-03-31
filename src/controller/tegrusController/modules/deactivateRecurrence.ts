import { Request, Response } from 'express';
// import deactivateRecurrenceService from '../../../service/tegrus.services/deactivateRecurrence';

const deactivateRecurrence = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        // const recurrenceId = req?.params?.recurrenceId;
        // const statusRecurrence = await deactivateRecurrenceService(
        //     recurrenceId,
        // );

        return res.status(200).json({});
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { deactivateRecurrence };
