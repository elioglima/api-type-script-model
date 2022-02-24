// import { Cielo, CieloConstructor } from '../src/cielo';
// import test from 'tape';
// import { EnumCardType, EnumBrands } from '../src/enum';
// import { TransactionCreditCardRequestModel } from '../src/domain/Transactions/transactionCreditCard';
// import { ConsultTokenRequestModel } from 'cielo/dist/models/consults';
// import { TokenizeRequestModel } from 'cielo/dist/models/card/tokenize.request.model';

// function error(err: Object) {
//     console.log('Ocorreu o seguinte erro', err);
// }

// const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
// const brands = [
//     'Visa',
//     'Master',
//     'Amex',
//     'Elo',
//     'Aura',
//     'JCB',
//     'Diners',
//     'Discover',
//     'Hipercard',
// ];


// const cielo = new Cielo();

// brands.forEach(brand => {
//     test(`Tokenize card brand ${brand}`, async t => {
//         const tokenParams: TokenizeRequestModel = {
//             customerName: 'Comprádor Teste Cíéló Áá',
//             cardNumber: '5555666677778884',
//             holder: 'Comprador T Cielo',
//             expirationDate: '12/2021',
//             brand: brand as EnumBrands,
//         };
//         const token = await cielo.card
//             .createCardTokenized(tokenParams)
//             .catch(error);
//         if (!token) {
//             t.end('Erro ao tokenizar o cartão');
//             return;
//         }

//         t.assert('cardToken' in token, 'retorno cardToken correto');
//         t.assert(regexToken.test(token.cardToken), 'CardToken valido');

//         // Venda com cartão tokenizado
//         const vendaParams: TransactionCreditCardRequestModel = {
//             merchantOrderId: 'CieloNodeJS000003',
//             customer: {
//                 name: 'Comprádor Teste Cíéló Áá',
//             },
//             payment: {
//                 type: EnumCardType.CREDIT,
//                 amount: 100,
//                 installments: 1,
//                 softDescriptor: '123456789ABCD',
//                 creditCard: {
//                     cardToken: token.cardToken,
//                     securityCode: '262',
//                     brand: brand as EnumBrands,
//                 },
//             },
//         };
//         const creditCard = cielo.getCreditCard();
//         const venda = await creditCard?.transaction(vendaParams).catch(error);
//         if (!venda) {
//             t.end('Erro ao criar uma venda com o cartão tokenizado');
//             return;
//         }
//         t.assert(venda.payment.status === 1, 'Status da Venda Correto');
//         t.assert(
//             regexToken.test(venda.payment.paymentId),
//             'venda.Payment.PaymentId valido',
//         );
//         t.assert(
//             venda.payment.amount === vendaParams.payment.amount,
//             'Valor da Transacao de Venda correto',
//         );
//         t.assert(
//             venda.customer.name === 'Comprador Teste Cielo Aa',
//             'Normalizacao do nome do cliente no boleto',
//         );

//         const consultaCartaoTokenizadoParams: ConsultTokenRequestModel = {
//             cardToken: token.cardToken,
//         };
//         const consulta = cielo.getConsult();
//         const consultaCartao = await consulta
//             ?.cardToken(consultaCartaoTokenizadoParams)
//             .catch(error);

//         if (!consultaCartao) {
//             t.end('Não foi possivel fazer a consulta do cartão tokenizado');
//             return;
//         }
//         t.assert(
//             consultaCartao.holder === tokenParams.holder,
//             'Holder do cartão tokenizado ok',
//         );
//         t.assert(
//             consultaCartao.cardNumber.endsWith(
//                 tokenParams.cardNumber.substr(-4, 4),
//             ),
//             'Holder do cartão tokenizado ok',
//         );

//         t.end();
//     });
// });
