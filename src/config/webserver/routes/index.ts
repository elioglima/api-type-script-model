import { Request, Response, Router } from 'express';
import { payment } from './payment.routes';

const routes = Router();

routes.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

routes.use('/v1/payment', payment);

export default routes;
