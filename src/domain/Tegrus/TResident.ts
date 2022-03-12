import { TDOC } from "./TDOC"

export interface TResident {
    id: Number;
    name: string;
    nationality: string;
    nickname: string;
    email: string;
    birthDate: string;
    smartphone: string;
    documentType: TDOC;
    document: string;
    description: string;
}
