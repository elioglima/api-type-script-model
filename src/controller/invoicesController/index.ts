import { Request, Response } from "express";
import * as md from "./modules"


export class InvoicesController {
    
    public getInvoices = async (req: Request, res: Response) => {
        return await md.getInvoices(req, res)
    };


}




