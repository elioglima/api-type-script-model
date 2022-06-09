import { TDOC } from './TDOC';

export interface TResident {
    id: number;
    name: string;
    nationality: string;
    nickname: string;
    email: string;
    birthDate: string;
    smartphone: string;
    documentType: TDOC;
    document: string;
    description: string;
    apartmentId: number;
    enterpriseId: number;
    contractCode: string;
    startDateContract: string;
    endDateContract: string;
    recurrenceId?: string;
    startReferenceDate: Date;
    endReferenceDate: Date;
    exitDate?: Date;
    err?: boolean;
    data?: any;
    responsiblePayment?: any;
}
