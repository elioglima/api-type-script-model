import { Request, Response } from "express";
import * as md from "./modules/"


export class InvoicesController {

    public invoicesFilter = async (req: Request, res: Response) => {
        return await md.invoicesFilter(req, res)
    };

    public findResidentRecurrence = async (req: Request, res: Response) => {
        return await md.findResidentRecurrence(req, res)
    };


}

