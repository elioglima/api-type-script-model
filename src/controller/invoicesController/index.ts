import { Request, Response } from "express";
import * as md from "./modules/invoicesFilter"


export class InvoicesController {
    
    public invoicesFilter = async (req: Request, res: Response) => {
        return await md.invoicesFilter(req, res)
    };


}

