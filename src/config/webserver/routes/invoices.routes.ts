import { Router } from 'express';
import { invoicesFilter } from '../../../controller/invoicesController';

export const invoices: Router = Router();
invoices.post('/', invoicesFilter);
