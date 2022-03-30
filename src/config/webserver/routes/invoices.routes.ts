import { Router } from 'express';
import { InvoicesController } from '../../../controller/invoicesController';

const invoiceController = new InvoicesController();

export const invoices: Router = Router();

invoices.get('/getInvoice', invoiceController.getInvoices);
