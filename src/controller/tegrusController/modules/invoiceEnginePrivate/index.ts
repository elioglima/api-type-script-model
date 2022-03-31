import { Request, Response } from 'express';

const invoiceEnginePrivate = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        /*

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
                        },
                    ]
                }
            }

        */
        res.status(200).json(req.body);
    } catch (error) {}
};

export { invoiceEnginePrivate };
