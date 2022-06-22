import { Router } from 'express';
import { Request, Response } from 'express';

export const checked: Router = Router();

checked.get('/', (_req: Request, res: Response) => {
    return res.status(200).json({ date: new Date() });
});
