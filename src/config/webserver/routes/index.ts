import { Request, Response, Router } from 'express';
import { payment } from './payment.routes';
import { tegrus } from './tegrus.routes';
import { invoices } from './invoices.routes';

const routes = Router();

routes.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

routes.use('/v1/payment', payment);
routes.use('/v1/tegrus', tegrus);
routes.use('/v1/invoices', invoices);

export default routes;
