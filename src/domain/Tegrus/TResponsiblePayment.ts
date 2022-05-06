import { TDOC } from './TDOC';

export type TResponsiblePayment = {
    id?: number;
    apartmentId?: number;
    enterpriseId?: number;
    name: string; // 'nome do pagador';
    typeDocument: TDOC;
    document: string; // '111.111.111-55';
    mail: string; // 'pagador@teste.com.br';
};
