import { Router } from 'express';
import { PaymentController } from '../../../controller/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .post('/config', paymentController.createPaymentconfig)
    .post('/card', paymentController.CardAdd)
    .get('/card/:userId', paymentController.UserCardListByFilter)
    .delete('/card/:id', paymentController.CardRemove)
    .get('/:userId', paymentController.getReceipt)
    .get('/', paymentController.getAllPayments)
    .put('/', paymentController.MakePayment)
