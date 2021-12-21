import { Router } from 'express';
import { PaymentController } from '../../../controller/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .get('/', paymentController.getAll)
    .get('/:id', paymentController.getById)
    .get('/breakfast/:idEnterprise', paymentController.getBreakfast)
    .post('/', paymentController.create)
    .put('/', paymentController.update)
    .delete('/:id', paymentController.delete);
