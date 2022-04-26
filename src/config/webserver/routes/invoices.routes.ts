import { Router } from 'express';
import { InvoicesController } from '../../../controller/invoicesController';

const invoicesController = new InvoicesController();

export const invoices: Router = Router();
invoices.post('/', invoicesController.invoicesFilter);
invoices.get('/recurrence/:id', invoicesController.findResidentRecurrence);
