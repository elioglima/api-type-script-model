import { Router } from 'express';
import { PaymentResponsibleController } from '../../../controller/paymentResponsibleController/paymentResponsibleController';

const paymentResponsibleController = new PaymentResponsibleController();
export const responsible: Router = Router();

responsible.get(
    '/:userId',
    paymentResponsibleController.findByResponsiblePayment,
);
