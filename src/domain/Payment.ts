import { PaymentStatus } from "src/enum/PaymentStatusEnum";
import { PaymentType } from "src/enum/PaymentTypeEnum";

export interface Payment {
    id: number;
    gatewayId: string;
    type: PaymentType;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
