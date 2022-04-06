import { Request, Response } from 'express';
import * as md from './modules';

export class TegrusController {
    public gatewayPaynow = async (req: Request, res: Response) => {
        return await md.gatewayPaynow(req, res);
    };

    public invoiceEngine = async (req: Request, res: Response) => {
        return await md.invoiceEngine(req, res);
    };

    public invoiceEnginePrivate = async (req: Request, res: Response) => {
        return await md.invoiceEnginePrivate(req, res);
    };

    public hashSearch = async (req: Request, res: Response) => {
        return await md.hashSearch(req, res);
    }

}
