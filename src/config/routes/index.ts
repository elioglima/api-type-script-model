import { Router } from 'express';
import { checked } from './checked.routes';

const routes = Router();
routes.use('/', checked);

export default routes;
