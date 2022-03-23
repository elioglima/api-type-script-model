import { Request, Response } from 'express';
import * as md from './modules';

export class TegrusController {
    public firstPaymentCreate = async (req: Request, res: Response) => {
        return await md.firstPaymentCreate(req, res)
    };

    public paymentRecurrentExecute = async (req: Request, res: Response) => {
        return await md.paymentRecurrentExecute(req, res)
    };


    public invoiceEngine = async (req: Request, res: Response) => {
        return await md.invoiceEngine(req, res)
    };


    public cancelContract = async (req: Request, res: Response) => {
        return await md.cancelContract(req, res)
    };

    public hashSearch =async (req: Request, res: Response) => {
        return await md.hashSearch(req, res)
        
    }
}
