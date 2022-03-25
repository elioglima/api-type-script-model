import { Router } from 'express';
import * as InvoicesController from '../../../controller/invoicesController';

export const invoices: Router = Router();
invoices.get('/', InvoicesController.getInvoices);
