import { Router } from 'express';
import { PaymentController } from '../../../controller/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .post('/config', paymentController.createPaymentconfig)
    .post('/card', paymentController.CardAdd)
    .get('/card/:userId', paymentController.UserCardListByFilter)
    .get('/card/id/:id', paymentController.findCardById)
    .delete('/card/:id', paymentController.CardRemove)
    .get('/id/:id', paymentController.getById)
    .get('/:userId', paymentController.getReceipt)
    .get('/', paymentController.getAllPayments)
    .put('/', paymentController.MakePayment)
    .put('/refound/:id', paymentController.RefoundPayment)
    .put('/card', paymentController.updateCard)
    .put('/inactivate-card/:userId', paymentController.inactivateUserCards);
