import { Request, Response } from 'express';

const invoiceEnginePrivate = async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        /*
            obs: ver tempo de tentatias
            obs: enviar mensagem cliente
            obs: esta funcao sera chamada por um servico ou uma cron 2x por dia

            - consultar todas no prazo de 60 dias invoices que sejam:
                - campo para pesquisa - invoice.dueDate
                - tipe = rent 
                - status = issued

            - promiseAll percorrer as faturas
            - ao percorrer as faturas
                - verificar na cielo se a recorrencia ja foi efetivada

                    - caso esteja como paid 
                        - atualizar o statusIncoice da tb invoice e retornar para o reducer

                    - caso nao esteja paid verificar 
                        - se a mesma ultrapassa 30 dias caso ultrapasse atulizar como 
                            - statusinvoice=paymentError   


            - no resultado do promiseAll
                - preprar payload de retorno para tegrus no padrao a baixo


            { 
                statusInvoice: {	
                    invoices:[
                        { 
                            “invoiceId”: 125, 
                            “type”:
                            "statusInvoice": "'canceled' | 'issued' | 'paid' | “payment_error",
                            "paymentMethod": "'ticket' | 'transfer' | 'credit'  |'international_transfer', ‘courtesy’",
                            “paymentDate”: “10/02/2022 23:02”, 
                            “messageError:”:
                            recurenceL {
                                "err": false,
                                "recurrentPaymentId": "0cdf46b7-661e-43f8-93b0-f1a47917b1e3",
                                "nextRecurrency": "2022-05-10",
                                "startDate": "2022-04-10",
                                "interval": "Monthly",
                                "amount": 23800,
                                "country": "BRA",
                                "createDate": "2022-04-10T00:00:00",
                                "currency": "BRL",
                                "currentRecurrencyTry": 0,
                                "provider": "Simulado",
                                "recurrencyDay": 10,
                                "successfulRecurrences": 0,
                                "links": [
                                    {
                                        "method": "GET",
                                        "rel": "self",
                                        "href": "https://apiquerysandbox.cieloecommerce.cielo.com.br/1/RecurrentPayment/0cdf46b7-661e-43f8-93b0-f1a47917b1e3"
                                    }
                                ],
                                "recurrentTransactions": [
                                    {
                                        "paymentId": "c659f5c3-70cf-4a9e-bf77-7b04c5d38eff",
                                        "paymentNumber": 0,
                                        "tryNumber": 1
                                    }
                                ],
                                "status": 1,
                            }
                        },
                    ]
                }
            }

        */
        res.status(200).json(req.body);
    } catch (error) {}
};

export { invoiceEnginePrivate };
