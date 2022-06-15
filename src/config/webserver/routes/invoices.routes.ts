import { Router } from 'express';
import { InvoicesController } from '../../../controller/invoicesController';

const invoicesController = new InvoicesController();

export const invoices: Router = Router();
invoices.get('/recurrence/:id', invoicesController.findResidentRecurrence);
invoices.post('/', invoicesController.invoicesFilter);
