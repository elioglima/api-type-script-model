import { EnumFraudAnalysisStatus } from 'src/enum/FraudANalysisStatusEnum';
import { ReplyDataResponseModel } from './replay-data.model';

export interface FraudAnalysisResponseModel {
    id: string;
    status: EnumFraudAnalysisStatus;
    fraudAnalysisReasonCode: number;
    replyData: ReplyDataResponseModel;
}
