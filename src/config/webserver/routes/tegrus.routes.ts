import { Router } from 'express';
import { TegrusController } from '../../../controller/tegrusController';

const PaymentTegrusController = new TegrusController();
export const tegrus: Router = Router();

tegrus
    .post('/firstPayment/create', PaymentTegrusController.firstPaymentCreate)
    .get('/firstPayment/:hash', PaymentTegrusController.hashSearch)
    .post('/firstPayment/execute', PaymentTegrusController.firstPaymentExecute)
    .post('/invoiceEngine', PaymentTegrusController.invoiceEngine)
    .post('/cancelContract', PaymentTegrusController.cancelContract);

