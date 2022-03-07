import { Request, Response, Router } from 'express';
import { payment } from './payment.routes';
import { tegrus } from './tegrus.routes';

const routes = Router();

routes.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

routes.use('/v1/payment', payment);
routes.use('/v1/tegrus', tegrus);

export default routes;
