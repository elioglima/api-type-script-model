import { TResident } from '../domain/Tegrus';

export const invoiceToTResident = (residentIdenty: any) => {
    if (!residentIdenty) return false;

    const resident: any = residentIdenty;
    const data: TResident = {
        id: resident?.id,
        name: resident?.name,
        nationality: resident?.nationality,
        nickname: resident?.nickname || '',
        email: resident?.email,
        birthDate: resident?.birthDate,
        smartphone: resident?.smartphone,
        documentType: resident?.documentType,
        document: resident?.document,
        description: resident?.description,
        apartmentId: resident?.description,
        enterpriseId: resident?.enterpriseId,
        contractCode: resident?.contractCode,
        startDateContract: resident?.nationality,
        endDateContract: resident?.nationality,
        recurrenceId: resident?.nationality,
        startReferenceDate: resident?.startReferenceDate,
        endReferenceDate: resident?.endReferenceDate,
    };

    return data;
};
