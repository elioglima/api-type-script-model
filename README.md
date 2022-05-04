# Payment Api

## <a name="instalacao"></a> Installation

```js
npm install --save cielo
```

## <a name="howuse"></a> Como utilizar?

### Iniciando

... sss teste

```ts
import { CieloConstructor, Cielo } from 'cielo';

const cieloParams: CieloConstructor = {
    merchantId: 'xxxxxxxxxxxxxxxxxxxxxxx',
    merchantKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    requestId: 'xxxxxxx', // Opcional - Identificação do Servidor na Cielo
    sandbox: true, // Opcional - Ambiente de Testes
    debug: true, // Opcional - Exibe os dados enviados na requisição para a Cielo
};

const cielo = new Cielo(cieloParams);
```

### <a name="creditSimpleTransaction"></a> Criando uma transação

.
Usando Promise sss

```ts
const vendaParams: TransactionCreditCardRequestModel = {
    customer: {
        name: 'Comprador crédito',
    },
    merchantOrderId: '2014111703',
    payment: {
        amount: 10000, // R$100,00
        creditCard: {
            brand: EnumBrands.VISA,
            cardNumber: '4532117080573700',
            holder: 'Comprador T Cielo',
            expirationDate: '12/2021',
        },
        installments: 1,
        softDescriptor: 'Banzeh',
        type: EnumCardType.CREDIT,
        capture: false,
    },
};

cielo.creditCard
    .transaction(dadosSale)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

Ou usando Async / Await

```ts
const transaction = await cielo.creditCard.transaction(dadosSale);
console.log(transaction);
```

### <a name="creditSaleCapture"></a> Capturando uma venda

```ts
const capturaVendaParams: CaptureRequestModel = {
    paymentId: '24bc8366-fc31-4d6c-8555-17049a836a07',
    amount: 2000, // Caso o valor não seja definido, captura a venda no valor total
};

cielo.creditCard
    .captureSaleTransaction(capturaVendaParams)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

### <a name="creditCancelSale"></a> Cancelando uma venda

```js sss
const cancelamentoVendaParams: CancelTransactionRequestModel = {
    paymentId: '24bc8366-fc31-4d6c-8555-17049a836a07',
    amount: 100, // Caso o valor não seja definido, cancela a venda no valor total
};

cielo.creditCard
    .cancelTransaction(cancelamentoVendaParams)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

Ou usando Async / Await

```ts
const cancel = await cielo.creditCard.cancelSale(dadosSale);
console.log(cancel);
```

## <a name="recorrencia"></a> Recorrência

### <a name="creatingRecurrence"></a> Criando Recorrências

```ts
const createRecurrencyParams: RecurrentCreateModel = {
    merchantOrderId: '2014113245231706',
    customer: {
        name: 'Comprador rec programada',
    },
    payment: {
        type: EnumCardType.CREDIT,
        amount: 1500,
        installments: 1,
        softDescriptor: '123456789ABCD',
        currency: 'BRL',
        country: 'BRA',
        recurrentPayment: {
            authorizeNow: true,
            endDate: '2022-12-01',
            interval: EnumRecurrentPaymentInterval.SEMIANNUAL,
        },
        creditCard: {
            cardNumber: '4024007197692931',
            holder: 'Teste Holder',
            expirationDate: '12/2030',
            securityCode: '262',
            saveCard: false,
            brand: 'Visa' as EnumBrands,
        },
    },
};

cielo.recurrent
    .create(createRecurrencyParams)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

### <a name="modifyRecurrence"></a> Modificando Recorrências

#### <a name="modifyRecurrenceCustomer"></a> Modificando dados do comprador

```ts
const updateCustomer: RecurrentModifyCustomerModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
    customer: {
        name: 'Customer',
        email: 'customer@teste.com',
        birthdate: '1999-12-12',
        identity: '22658954236',
        identityType: 'CPF',
        address: {
            street: 'Rua Teste',
            number: '174',
            complement: 'AP 201',
            zipCode: '21241140',
            city: 'Rio de Janeiro',
            state: 'RJ',
            country: 'BRA',
        },
        deliveryAddress: {
            street: 'Outra Rua Teste',
            number: '123',
            complement: 'AP 111',
            zipCode: '21241111',
            city: 'Qualquer Lugar',
            state: 'QL',
            country: 'BRA',
        },
    },
};

cielo.recurrent
    .modifyCustomer(updateCustomer)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

#### <a name="modifyRecurrenceEndDate"></a> Modificando data final da Recorrência

```ts
const updateEndDate: RecurrentModifyEndDateModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
    endDate: '2021-01-09',
};

cielo.recurrent
    .modifyEndDate(updateEndDate)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

#### <a name="modifyRecurrenceInterval"></a> Modificando intevalo da Recorrência

```ts
const modifyRecurrencyParams: RecurrentModifyIntervalModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
    interval: EnumRecurrentPaymentUpdateInterval.MONTHLY,
};

cielo.recurrent
    .modifyInterval(modifyRecurrencyParams)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

#### <a name="modifyRecurrenceRecurrencyDay"></a> Modificando dia da Recorrência

const updateRecurrencyDay: RecurrentModifyDayModel = {
paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
recurrencyDay: 10,
};

cielo.recurrent
.modifyRecurrencyDay(updateRecurrencyDay)
.then(data => {
return console.log(data);
})
.catch(err => {
return console.error('ERRO', err);
});

````

#### <a name="modifyRecurrenceAmount"></a> Modificando o valor da Recorrência

```ts
const updateAmount: RecurrentModifyAmountModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
    amount: 156, // Valor do Pedido em centavos: 156 equivale a R$ 1,56
};

cielo.recurrent
    .modifyAmount(updateAmount)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
````

#### <a name="modifyRecurrenceNextPaymentDate"></a> Modificando data do próximo Pagamento

```ts
const updateNextPaymentDate: RecurrentModifyNextPaymentDateModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
    nextPaymentDate: '2020-05-20',
};

cielo.recurrent.modifyNextPaymentDate
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

#### <a name="modifyRecurrencePayment"></a> Modificando dados do Pagamento da Recorrência (@todo)

```ts
const updatePayment: RecurrentModifyPaymentModel = {
    recurrenceId: recurrenceId,
    payment: {
        type: EnumCardType.CREDIT,
        amount: '123',
        installments: 3,
        country: 'USA',
        currency: 'BRL',
        softDescriptor: '123456789ABCD',
        creditCard: {
            brand: EnumBrands.VISA,
            holder: 'Teset card',
            cardNumber: '1234123412341232',
            expirationDate: '12/2030',
        },
    },
};

cielo.recurrent
    .modifyPayment(updatePayment)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

#### <a name="modifyRecurrenceDeactivate"></a> Desabilitando um Pedido Recorrente

```ts
const deactivateRecurrencyParams: RecurrentModifyModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
};

cielo.recurrent
    .deactivate(deactivateRecurrencyParams)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

#### <a name="modifyRecurrenceReactivate"></a> Reabilitando um Pedido Recorrente

```ts sssss
const reactivateRecurrencyParams: RecurrentModifyModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrenceId,
};

cielo.recurrent
    .reactivate(updateReactivate)
    .then(data => {
        return console.log(data);
    })
    .catch(err => {
        return console.error('ERRO', err);
    });
```

tese
