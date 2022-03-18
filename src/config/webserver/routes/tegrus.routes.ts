import { Router } from 'express';
import { TegrusController } from '../../../controller/tegrusController';

const PaymentTegrusController = new TegrusController();
export const tegrus: Router = Router();

tegrus
    .post('/topic/createResident', PaymentTegrusController.firstPaymentCreate)
    .post('/topic/invoiceEngine', PaymentTegrusController.invoiceEngine)
    .get('/firstPayment/:hash', PaymentTegrusController.hashSearch)
    .post('/firstPayment/execute', PaymentTegrusController.firstPaymentExecute)
    .post('/cancelContract', PaymentTegrusController.cancelContract);

