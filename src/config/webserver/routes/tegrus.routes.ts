import { Router } from 'express';
import { TegrusController } from '../../../controller/tegrusController';

const PaymentTegrusController = new TegrusController();
export const tegrus: Router = Router();

tegrus
    .post('/topic/createResident', PaymentTegrusController.firstPaymentCreate)
    .post('/topic/invoiceEngine', PaymentTegrusController.invoiceEngine)
    .get('/topic/invoiceEngine', PaymentTegrusController.invoiceEnginePrivate)
    .get('/firstPayment/:hash', PaymentTegrusController.hashSearch)
    .post(
        '/paymentRecurrent/execute',
        PaymentTegrusController.paymentRecurrentExecute,
    )
    .post('/cancelContract', PaymentTegrusController.cancelContract)
    .put(
        '/deactivateRecurrence/:recurrenceId',
        PaymentTegrusController.deactivateRecurrence,
    );
