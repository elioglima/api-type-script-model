import { Router } from 'express';
import { PaymentController } from '../../../controller/paymentController/PaymentController';

const paymentController = new PaymentController();
export const payment: Router = Router();

payment
    .post('/config', paymentController.createPaymentconfig)
    .get('/card/:userId', paymentController.UserCardListByFilter)
    .delete('/card/:id', paymentController.CardRemove)
    .get('/card/id/:id', paymentController.findCardById)
    .post('/card', paymentController.CardAdd)
    .put('/card', paymentController.updateCard)
    .put('/inactivate-card/:userId', paymentController.inactivateUserCards)
    .delete('/refund/invoice/:invoiceId', paymentController.RefoundPayment)
    .put('/refund/:id', paymentController.RefoundPayment)
    .post('/refund/recurrence', paymentController.RefundRecurrencePayment)
    .post('/pix', paymentController.makePix)
    .get('/pix/getReceipt/:merchantOrderId', paymentController.getReceiptPix)
    .put('/card/recurrence/change/:invoiceId', paymentController.changeCard)
    .get(
        '/card/recurrence/:userId/:residentId',
        paymentController.cardRecurrence,
    )
    .put(
        '/card/recurrence/:userId/:residentId',
        paymentController.changeCardRecurrence,
    )
    .get('/receipt/:id', paymentController.getReceiptByPaymentId)
    .get('/preRegister/:id', paymentController.getPreRegisterUserData)
    .get('/id/:id', paymentController.getById)
    .get('/:userId', paymentController.getReceipt)
    .get('/', paymentController.getAllPayments)
    .put('/', paymentController.MakePayment);
