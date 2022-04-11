import { Router } from 'express';
import RecurrenceService from 'src/service/recurrenceService';
import { TegrusController } from '../../../controller/tegrusController';


const recurrenceService = new RecurrenceService();
const PaymentTegrusController = new TegrusController();
export const tegrus: Router = Router();

tegrus
    .post('/topic/invoiceEngine', PaymentTegrusController.invoiceEngine)
    .get('/topic/invoiceEngine', PaymentTegrusController.invoiceEnginePrivate)
    .get('/gateway/:hash', PaymentTegrusController.hashSearch)
    .post('/gateway/paynow', PaymentTegrusController.gatewayPaynow)
    
