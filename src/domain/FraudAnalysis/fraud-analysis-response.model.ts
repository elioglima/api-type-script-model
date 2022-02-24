import { EnumFraudAnalysisStatus } from '../../enum/FraudANalysisStatusEnum';
import { ReplyDataResponseModel } from './replay-data.model';

export interface FraudAnalysisResponseModel {
    id: string;
    status: EnumFraudAnalysisStatus;
    fraudAnalysisReasonCode: number;
    replyData: ReplyDataResponseModel;
}
