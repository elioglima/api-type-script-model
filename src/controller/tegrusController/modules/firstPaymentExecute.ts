import { Request, Response } from 'express';
import { TFirstPaymentExecReq } from '../../../domain/Tegrus';

const firstPaymentExecute = async (req: Request, res: Response) => {
    try {
        const body: TFirstPaymentExecReq = req?.body;

        /*
            - consultar dados 
                - tabela de hash
                - pre cadastro usuario
                - invoices

            - fazer o pagamento da recorrencia
                startReferenceDate: number,
                endReferenceDate: number,
                invoiceId

            - cadastrar o usuario como desativado
                - verificar na hora de cadastrar o usuario 
            - 
        */

        return res.status(200).json(body);
    } catch (error: any) {
        return res.status(422).json(error);
    }
};

export { firstPaymentExecute };

/* 

Front - Primeiro Pagamento 

tegrus
    - cadastramento fatura
        - envio ao cliente
            - cliente clica no link abre a tela - http://link?hash
                - front
                    - pega o hash e faz um get para pegar os dados da tela                    
                        - GET - http://URL/6366bd0b79d5ee877a4e5c97a540a31dfa7982739ae53137b9dee7122f266043
                            response:
                            {
                                status: 200,
                                data: {      
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
                                        "description": "Teste teste",
                                        "externalId": "123123",
                                        "contractCode": "XD2545455",
                                        "startDateContract": "XXXXX",
                                        "endDateContract": "YYYY",
                                    },
                                    "invoice":{
                                        "invoiceId": 4567,
                                        "apartmentId": 171,
                                        "residentId": 22,
                                        "enterpriseId": 69,
                                        "value": 56.5,
                                        "condominium": 456.78,
                                        "discount": 2,
                                        "tax": 10,
                                        "refund": 10,
                                        "fine": 14,
                                        "referenceDate": "2022-03-12",
                                        "dueDate": "2022-03-12",
                                        "description": "Teste",
                                    }
                                }
                            }

                            - possiveis telas nao previstas
                                - hash nao encontrado
                                    {
                                        status: 401,
                                        err: true,
                                        data: {
                                            message: 'pagamento invalido'
                                        }

                                    }


                                - erro na api ou conexao
                                    {
                                        status: 401,
                                        err: true,
                                        data: {
                                            message: 'ops, algo aconteceu'
                                        }

                                    }

                                - hash expirado
                                    {
                                        status: 401,
                                        err: true,
                                        data: {
                                            message: 'pagamento vencido'
                                        }

                                    }

                            - apos o preenchimento dos dados necessarios

                                - POST - http://URL/paynow
                                    {
                                        "invoice":{
                                            "invoiceId": 4567,
                                            "apartmentId": 171,
                                            "residentId": 22,
                                            "enterpriseId": 69,
                                        }, {
                                            cardNumber: string,
                                            brand: EnumBrands,
                                            customerName: string,
                                            expirationDate: string,
                                            holder: string,
                                        }
                                    }

                                    - possiveis respostas
                                        - sucesso
                                            {
                                                status: 200,
                                                data: {
                                                        message: 'pagamento efetuado com sucesso'
                                                }

                                            }


                                        - erro generico - tela nao prevista
                                            {
                                                status: 500,
                                                data: {
                                                        message: 'o pagamento nao pode ser processado, tente mais tarde'
                                                }

                                            }



                                            */
