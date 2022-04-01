    https://developercielo.github.io/manual/cielo-ecommerce#tokeniza%C3%A7%C3%A3o-de-cart%C3%B5es

    "host": "jflrealty.cqisbfzuue6q.us-east-2.rds.amazonaws.com",
    "port": 3306,
    "username": "jflmanager",
    "password": "6Yj4yB70SwZe6MYe8Uwc",
    "database": "jflrealty",

    - criar token para transacoes internas
        - criar middlewares para validar acesso

    - TABELAS
        - Criacao de tabela de dados lista cartoes
            - Modelo Entity - 2h30
            - nome da tabela: paymentCards

            - createdAt             - data de cadastro
            - idUser                - id do usuario
            - token                 - token da cielo (cardToken)
            - lastFourNumberCard    - os quatros ultimos numero do cartao
            - Brand                 - nome da bandeira

ss - Criacao de tabela de dados pagamento - 2h30 - Modelo Entity - 2h30 - nome da tabela: payment

            - createdAt
            - userId
            - descriptionMessage
            - descriptionIDReference
            - valor
            - transactionId
            - transactionMessage
            - status
                - Pago
                - Rejeitado
                - Cancelado
                - Estorno

        - tabelas de logs - 2h30
            - criar tabela de log de transacoes
                - Modelo Entity - 2h30
                - nome da tabela: paymentLogTransaction

            - criar tabela de log de cards
                - Modelo Entity - 2h30
                - nome da tabela: paymentLogCards



    - endpoints
        - criar endpoint para efetuar pagamento
        - payment/now - 8h
            - tratativas de erros
                - verificar se todos os campos foram digitados
                - verificar se o cartao é valido
                - verificar se a validade do cartao esta no prazo

            - efetuar pagamento - na hora
            - regras reversivel
            - regras irreverssivel

            request: {
                idUser: number, - id do usuario logado
                cardNumber string,
                cardSecurityCode: string,
                cardDueDay: Number,
                cardDueYear: Number,
                cardBrand: string,

                idCard - opcional
            }

        - criar endpoint para consulta extrato
        - payment/find/extract - 2h
            - extrato de pagamento
            - consulta extrato
            - consultas no maximo 5 meses por vez
            - campo de idTransaction opcional

            {
                idUser: number, - id do usuario logado
                dateStart,
                dateEnd,
                idTransaction
            }

        - criar endpoint para consulta de cartao
        - payment/card/find -2
            - cadastrar cartao
            - para consultar passar id do proprietario da locacao ou apartamento
            payload: { id, idUser }


        - criar endpoint para adicionar de cartao
        - payment/card/add
            - cadastrar cartao
            - adicionar no maximo 5 cartoes
            - adicionar cartao na tabela de cartoes
            - adicionar cartao na cielo

        - criar endpoint para remover de cartao
        - payment/card/remove
            - cartao da cielo
            - remover cartao base de dados

        - obs:
            - lista de cartoes nao aceitos


    - CieloAdapter.ts - arquivo referente a transacoes entre cielo e jfl
        - colcoar credenciais

        - _request(metodo, uri, payload, opt) - 4h
            - funcao com a funcionalidade generica para efetuar as requisicoes
            - definiar variavel global

        - criar metodos
        - CieloAdapter.ts - arquivo referente a transacoes entre cielo e jfl

        - payNow() - 6h
            - Efetua pagamentos
            - POST - /1/sales/

            request cielo: {
                MerchantId,
                MerchantKey,
                RequestId,
                MerchantOrderId,
                Customer.Name,
                Customer.Status,
                Payment.Type,
                Payment.Amount,
                Payment.Installments,
                Payment.SoftDescriptor,
                Payment.ReturnUrl,
                CreditCard.CardToken,
                CreditCard.SecurityCode,
                CreditCard.Brand,
            }

            resposta: {
                ProofOfSale,
                Tid,
                AuthorizationCode,
                SoftDescriptor,
                PaymentId,
                ECI,
                Status,
                ReturnCode,
                ReturnMessage,
            }

        - CieloAdapter.ts - adiciona cartoes
        - cardAdd() - 6h
            - CieloAdapter.ts - arquivo referente a transacoes entre cielo e jfl
            - POST endpoint cielo - /1/card/
                - resposta Cardtoken

        - CieloAdapter.ts - Consulta cartoes
        - cardFind() - 6h
            - CieloAdapter.ts - arquivo referente a transacoes entre cielo e jfl
            - Consulta cartoes

        - CieloAdapter.ts - remove cartoes
        - cardRemove() - 6h
            - remove cartoes

        - CieloAdapter.ts - consulta por id
        - findId() - 6h
            - consulta por id



        - domain - idapter  - generico - 4h
            - Criar arquivo generico apra acessar os metodos de pagamentos pela controle

    - EXPOR ENDPOINT NA BFF

        - EXPOR ENDPOINT NA BFF - efetua o pagamento
        POST - payment/now para payment-api.post.payment/now - 4h
            - efetua o pagamento

            payload: {
                idUser: number, - id do usuario logado
                cardNumber string,
                cardSecurityCode: string,
                cardDueDay: Number,
                cardDueYear: Number,
                cardBrand: string,
                idCard - opcional
            }  ou {
                "MerchantOrderId":"2014111706",
                "Customer":{
                    "Name":"Comprador token 1.5"
                },
                "Payment":{
                    "Type":"CreditCard",
                    "Amount":100,
                    "Installments":1,
                    "CreditCard":{
                        "CardToken":"6fb7a669aca457a9e43009b3d66baef8bdefb49aa85434a5adb906d3f920bfeA",
                        "Brand":"Visa"
                    }
                }
            }

        - EXPOR ENDPOINT NA BFF - adicionar cartao
        POST - payment/card/add para payment-api.post.payment/card/add - 4h
            payload: { id, idUser, number }

        - EXPOR ENDPOINT NA BFF - remove cartao
        POST - payment/card/remove para payment-api.post.payment/card/remove - 4h
            - remove o cartao da lista
            payload: { id, idUser }

        - EXPOR ENDPOINT NA BFF - find cartao
        POST - payment/card/find para payment-api.post.payment/card/find - 4h
            - retorna a lista de todos os cartoes
            payload: { idUser }
