import { Router } from 'express';
import { TegrusController } from '../../../controller/tegrusController';
import {invoiceEnginePrivate} from '../../../controller/tegrusController/modules/invoiceEnginePrivate/'

const PaymentTegrusController = new TegrusController();
export const tegrus: Router = Router();

tegrus
    .post('/topic/invoiceEngine', PaymentTegrusController.invoiceEngine)
    .get('/topic/invoiceEngine', PaymentTegrusController.invoiceEnginePrivate)
    .get('/gateway/:hash', PaymentTegrusController.hashSearch)
    .post('/gateway/paynow', PaymentTegrusController.gatewayPaynow)
    .get('/teste', invoiceEnginePrivate)

