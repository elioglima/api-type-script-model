Payloads

Primeiro Pagamento

obs: as devolutivas para tegrus estao apontando para o rest que já utilizamos na url, que deverá ser criada /invoiceEngine.

Recebimento na opah :: Primeiro Pagamento

obs:
"firstPayment": true,
"anticipation": false,

{
"createResident": {
"externalId": "123123",
"apartmentId": 1,
"enterpriseId": 1,
"contractCode": "XABLAU",
"startDateContract": "XXXXX",
"endDateContract": "YYYY",
"resident": {
"id": 123,
"name": "Roberto Mota",
"nationality": "Brasil",
"nickname": "Beto",
"email": "roberto.mota@opah.com.br",
"birthDate": "1991-11-22",
"smartphone": "11982229534",
"documentType": "CPF",
"document": "922.909.940-65",
"description": "Teste teste"
},
"invoice": {
"invoiceId": 4567,
"apartmentId": 1,
"residentId": 22,
"enterpriseId": 1,
"value": 56.5,
"condominium": 456.78,
"discount": 2,
"tax": 10,
"refund": 10,
"fine": 14,
"referenceDate": "2022-03-12",
"dueDate": "2022-03-12",
"description": "Teste",
"anticipation": false,
"firstPayment": true,
"paymentMethod": "BOLETO",
"statusInvoice": "PAID"
}
}
}
Devolutiva opah para tegrus :: Primeiro Pagamento

{
"createResident": {
…dados do payload,
"returnOpah": {
"message": "success"  
 "linkInvoice": {
"invoiceId": "number",
"linkCredit": "string",
"linkPix": "string",
"linkBoleto": "string"
}
}
}
}

Emissão de Fatura

Recebimento opah :: Emissão de Fatura

obs:
"firstPayment": false,
"anticipation": false,

{  
 "createInvoice": {
"invoiceId": 4567,
"apartmentId": 1,
"residentId": 22,
"enterpriseId": 1,
"value": 56.5,
"condominium": 456.78,
"discount": 2,
"tax": 10,
"refund": 10,
"fine": 14,
"referenceDate": "2022-03-12",
"dueDate": "2022-03-12",
"description": "Teste",
"anticipation": false,
"firstPayment": false,
"paymentMethod": "BOLETO",
"statusInvoice": "PAID"
}
}
Devolutiva opah para tegrus :: Emissão de Faturas

{
"createInvoice": {
…dados do payload,
"returnOpah": {
"message": "success"  
 }
}
}

Antecipação de Fatura

Recebimento opah :: Antecipação de Fatura

obs:
"firstPayment": false,
"anticipation": true,

{
"createInvoice": {
"invoiceId": 4567,
"apartmentId": 1,
"residentId": 22,
"enterpriseId": 1,
"value": 56.5,
"condominium": 456.78,
"discount": 2,
"tax": 10,
"refund": 10,
"fine": 14,
"referenceDate": "2022-03-12",
"dueDate": "2022-03-12",
"description": "Teste",
"anticipation": false,
"firstPayment": false,
"paymentMethod": "BOLETO",
"statusInvoice": "PAID"
}

Devolutiva opah para tegrus :: Antecipação de Faturas

{
"createInvoice": {
…dados do payload,
"returnOpah": {
"message": "success" ,
}  
}

Atualiza status da fatura

Recebimento opah :: Atualiza status da fatura

{
"statusInvoice": {
"invoiceId": "number",
"description": "string",
"paidAt": "timestamp",
"paymentMethod": "'ticket' | 'transfer' | 'credit' 'international_transfer', ‘courtesy’",
"amountOfFailure": "number",
"statusInvoice": "'paid' | 'payment_problem'"
}
}

Devolutiva opah para tegrus :: Atualiza status da fatura

{
"statusInvoice": {
…dados do payload,
"returnOpah": {
"message": "success"
}
}
}

Remover fatura emitida

Recebimento opah :: Remover fatura emitida

{
"deleteInvoice": {
"invoiceId": "string",
"description": "string"
}
}

Devolutiva opah para tegrus :: Remover fatura emitida

{
"deleteInvoice": {
…dados do payload,
"returnOpah": {
"message": "success"
}
}
}

Cancelar Contrato

Recebimento opah :: Cancelar Contrato

{
"cancelContract": {
"residentId": "number",
"description": "string",
"unitId": "number",
"entrepriseId": "number",
"finishDate": "timestamp"
}
}

Devolutiva opah para tegrus :: Cancelar Contrato

{
"cancelContract": {
…dados do payload,
"returnOpah": {
"message": "success"
}
}
}

Fatura Spot

Recebimento opah :: Fatura Spot

{
"createInvoice": {
"invoiceId": "number",
"apartmentId": "number",
"residentId": "number",
"enterpriseId": "number",
"value": "number",
"condominium": "number",
"discount": "number",
"tax": "number",
"refund": "number",
"expense": "number",
"fine": "number",
"fineTicket": "number",
"startReferenceDate": "number",
"endReferenceDate": "number",
"dueDate": "number",
"description": "string",
"anticipation": "boolean",
"firstPayment": "boolean, –caso seja a primeira fatura, deve vir preenchido true.",
"type": "booking | fine | rent | spot",
"paymentMethod": "'ticket' | 'transfer' | 'credit' 'international_transfer', ‘courtesy’",
"statusInvoice": "'canceled' | 'issued' | 'paid'",
}
}

Devolutiva opah para tegrus :: Fatura Spot

{
"createInvoice": {
…dados do payload,
"returnOpah": {
"anticipation": true,
"firstPayment": false,
"message": "success"
}
}
}

Pagamento Fora do app
Recebimento opah :: Pagamento Fora do app

{
"statusInvoice": {
"invoiceId": "number",
"description": "string",
"paidAt": "timestamp",
"paymentMethod": "'ticket' | 'transfer' | 'credit' 'international_transfer', ‘courtesy’",
"statusInvoice": "'paid'"
}
}

Devolutiva opah para tegrus :: Pagamento Fora do app

{
"statusInvoice": {
…dados do payload,
"returnOpah": {
"anticipation": true,
"firstPayment": false,
"message": "success"
}
}
}

Fatura expirada

Recebimento opah :: Fatura expirada

{
"updateInvoice": {
"invoiceId": "number",
"apartmentId": "number",
"residentId": "number",
"enterpriseId": "number",
"value": "number",
"condominium": "number",
"discount": "number",
"tax": "number",
"refund": "number",
"expense": "number",
"fine": "number",
"fineTicket": "number",
"startReferenceDate": "number",
"endReferenceDate": "number",
"dueDate": "number",
"description": "string",
"anticipation": "boolean",
"firstPayment": "boolean, –caso seja a primeira fatura, deve vir preenchido true.",
"type": "booking | fine | rent | spot",
"paymentMethod": "'ticket' | 'transfer' | 'credit' 'international_transfer', ‘courtesy’",
"statusInvoice": "'canceled' | 'issued' | 'paid'",
}
}

Devolutiva opah para tegrus :: Fatura expirada

{
"updateInvoice": {
…dados do payload,
"returnOpah": {
"message": "success"
}
}
}
