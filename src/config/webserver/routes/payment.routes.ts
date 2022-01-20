import { Router } from 'express';
import { PaymentController } from '../../../controller/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .get('/gateway/:id', paymentController.getByGatewayId)
    .get('/:idTransaction', paymentController.getReceipt)
    .post('/', paymentController.MakePayment)
    .post('/card/list', paymentController.CardListByFilter)
    .put('/card/add', paymentController.CardAdd)

