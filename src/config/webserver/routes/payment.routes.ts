import { Router } from 'express';
import { PaymentController } from '../../../controller/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .get('/gateway/:id', paymentController.getByGatewayId)
    .get('/:id', paymentController.getById)
    .post('/', paymentController.create)
    .put('/', paymentController.update);
