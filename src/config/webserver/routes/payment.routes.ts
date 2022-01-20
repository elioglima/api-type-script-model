import { Router } from 'express';
import { PaymentController } from '../../../controller/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .get('/gateway/:id', paymentController.getByGatewayId)
    .get('/:idTransaction', paymentController.getReceipt)
    .post('/', paymentController.MakePayment)
    .get('/card', paymentController.CardListByFilter)
    .put('/card', paymentController.CardAdd)
    .delete('/card', paymentController.CardRemove)

