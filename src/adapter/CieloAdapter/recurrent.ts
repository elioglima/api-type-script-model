// import { CieloTransactionInterface } from '../../interface/cielo-transaction.interface';
// import {
//     IHttpResponse,
//     Utils,
//     IHttpRequestOptions,
//     HttpRequestMethodEnum,
// } from '../../utils/utils';
// import {
//     RecurrentCreateModel,
//     RecurrentModifyModel,
//     RecurrentCreateResponse,
//     RecurrentModifyDayModel,
//     RecurrentModifyAmountModel,
//     RecurrentModifyPaymentModel,
//     RecurrentModifyEndDateModel,
//     RecurrentModifyCustomerModel,
//     RecurrentModifyIntervalModel,
//     RecurrentModifyNextPaymentDateModel,
// } from '../../domain/RecurrentPayment/index';
// import { CustomerModel } from 'src/domain/Customer';
// import { PaymentRecurrentModifyModel } from 'src/domain/Payment';

export class Recurrent {
    // private cieloTransactionParams: CieloTransactionInterface;
    // private util: Utils;

    // constructor(transaction: CieloTransactionInterface) {
    //     this.cieloTransactionParams = transaction;
    //     this.util = new Utils(this.cieloTransactionParams);
    // }

    // // Criação de pagamento recorrente
    // public create(
    //     params: RecurrentCreateModel,
    // ): Promise<RecurrentCreateResponse> {
    //     return this.util.postToSales<
    //         RecurrentCreateResponse,
    //         RecurrentCreateModel
    //     >(params);
    // }

    // // Modificação do customer de pagamento recorrente
    // public modifyCustomer(
    //     params: RecurrentModifyCustomerModel,
    // ): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/Customer`,
    //         data: params.customer,
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // public modifyEndDate(
    //     params: RecurrentModifyEndDateModel,
    // ): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/EndDate`,
    //         data: params.endDate,
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // public modifyInterval(
    //     params: RecurrentModifyIntervalModel,
    // ): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/Interval`,
    //         data: params.interval,
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // public modifyRecurrencyDay(
    //     params: RecurrentModifyDayModel,
    // ): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/RecurrencyDay`,
    //         data: params.recurrencyDay,
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // // Modificação do valor de pagamento recorrente
    // public modifyAmount(
    //     params: RecurrentModifyAmountModel,
    // ): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/Amount`,
    //         data: (params.amount * 100).toString(),
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // // Modificação da data de pagamento recorrente
    // public modifyNextPaymentDate(
    //     params: RecurrentModifyNextPaymentDateModel,
    // ): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/NextPaymentDate`,
    //         data: params.nextPaymentDate,
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // // Modificação o tipo de pagamento
    // public modifyPayment(
    //     params: RecurrentModifyPaymentModel,
    // ): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/Payment`,
    //         data: params.payment,
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // // Desativando pagamento recorrente
    // public deactivate(params: RecurrentModifyModel): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/Deactivate`,
    //         data: '',
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // // Reactivando pagamento recorrente
    // public reactivate(params: RecurrentModifyModel): Promise<IHttpResponse> {
    //     const modifyParams = {
    //         path: `/1/RecurrentPayment/${params.paymentId}/Reactivate`,
    //         data: '',
    //     };
    //     return this.modify<IHttpResponse>(modifyParams);
    // }

    // private modify<_T>(params: {
    //     path: string;
    //     data: string | CustomerModel | PaymentRecurrentModifyModel | number;
    // }): Promise<IHttpResponse> {
    //     const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
    //         method: HttpRequestMethodEnum.PUT,
    //         path: params.path,
    //         hostname: this.cieloTransactionParams.hostnameTransacao,
    //     });

    //     return this.util.httpRequest(options, params.data);
    // }
}
