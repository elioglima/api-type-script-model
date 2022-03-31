import { Router } from 'express';
import { invoicesFilter } from '../../../controller/invoicesController/modules/invoicesFilter';

export const invoices: Router = Router();
invoices.post('/', invoicesFilter);
