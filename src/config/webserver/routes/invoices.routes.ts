import { Router } from 'express';
import { InvoicesController } from 'src/controller/invoicesController';


const invoicesController = new InvoicesController()

export const invoices: Router = Router();
invoices.post('/', invoicesController.invoicesFilter);
