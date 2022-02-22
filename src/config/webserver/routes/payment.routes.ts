import { Router } from 'express';
import { PaymentController } from '../../../controller/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .get('/', paymentController.getAllPayments)
    .get('/:userId', paymentController.getReceipt)
    .put('/', paymentController.MakePayment)
    .get('/card/:userId', paymentController.UserCardListByFilter)
    .post('/card', paymentController.CardAdd)
    .post('/config', paymentController.createPaymentconfig)
    .delete('/card/:id', paymentController.CardRemove);
