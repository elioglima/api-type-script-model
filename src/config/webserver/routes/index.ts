import { Request, Response, Router } from 'express';
import { service } from './payment.routes';

const routes = Router();

routes.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

routes.use('/v1/service', service);

export default routes;
