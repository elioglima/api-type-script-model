

    https://developercielo.github.io/manual/cielo-ecommerce#tokeniza%C3%A7%C3%A3o-de-cart%C3%B5es

    - criar token para transacoes internas
        - criar middlewares para validar acesso

    - TABELAS - 2h30
        - tabela de dados lista cartoes
            - idReference           - id da referencia do cadastro
            - typeReference         - tipo de referencia do cadastro (se é um usuario ou um apartamento etc...)
            - createdAt             - data de cadastro
            - createdUserId         - id do usuario de criacao
            - token                 - token da cielo (cardToken)
            - lastFourNumberCard    - os quatros ultimos numero do cartao
            - Brand                 - nome da bandeira


        - tabela de dados pagamento - 2h30
            - createdAt
            - userId
            - date
            - descricao
            - status 
                - Em Aberto
                - Pago
                    - idTransaction
                - Cancelado
            - valor    

        - tabelas de logs - 2h30
            - criar tabela de log de transacoes 
            - criar tabela de log de cards 


    - endpoints

        - payment/now - 8h        
            - tratativas de erros
                - verificar se todos os campos foram digitados
                - verificar se o cartao é valido   
                - verificar se a validade do cartao esta no prazo

            - efetuar pagamento - na hora
            - regras reversivel 
            - regras irreverssivel

            request: {
                idReference: number, - id do usuario logado
                typeReference: string, - usuario master                               
                
                cardNumber string,
                cardSecurityCode: string,
                cardDueDay: Number,
                cardDueYear: Number,
                cardBrand: string,

                idCard - opcional
            }

        - payment/future - 4h        
            - fila de futuros pagamentos - lançar futuros pagamento         
            - lancar pagamento
            - consultar responsavel pelo apartamento e lancar no is dele
            
            request: {
                idReference: number, - id do usuario logado 
                typeReference: string, - caso dependente 'DEPENDENTE' caso master 'MASTER'                                
                idMaster: string, - codigo do master do ap
                
                cardNumber string,
                cardSecurityCode: string,
                cardDueDay: Number,
                cardDueYear: Number,
                cardBrand: string,

                description: string, - indica a descricao do que sera comprado
                value: Number, - valor da compra
            }
        
        - payment/find/extract - 2h  
            - extrato de pagamento
            - consulta extrato
            - consultas no maximo 5 meses por vez
            - campo de idTransaction opcional

            {
                dateStart,
                dateEnd,
                idTransaction
            }

        - payment/card/find -2     
            - cadastrar cartao
            - para consultar passar id do proprietario da locacao ou apartamento
            payload: { id, idUser }
            

        - payment/card/add      
            - cadastrar cartao
            - adicionar no maximo 5 cartoes
            - adicionar cartao na tabela de cartoes
            - adicionar cartao na cielo

        - payment/card/remove   
            - cartao da cielo
            - remover cartao base de dados

        - obs:
            - lista de cartoes nao aceitos

    
    - EXPOR ENDPOINT NA BFF
    
        POST - payment/card/add para payment-api.post.payment/card/add
            payload: { id, idUser, number }

        POST - payment/card/remove para payment-api.post.payment/card/remove
            - remove o cartao da lista
            payload: { id, idUser }

        POST - payment/card/find para payment-api.post.payment/card/find
            - retorna a lista de todos os cartoes
            payload: { idUser }
