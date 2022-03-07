import { TResident } from "./TResident"
import { TInvoice } from "./TInvoice"

export type TFirstPayment = {
    externalId: number,
    apartamentId: number,
    enterpriseId: number,
    contractCode: string,
    startDateContract: string,
    endDateContract: string,
    resident: TResident,
    invoice: TInvoice
}
