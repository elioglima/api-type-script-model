import debug from 'debug';
import { Request, Response } from 'express';
import { CreateServiceService } from '../service/Service/CreateServiceService';
import { FindAllServiceService } from '../service/Service/FindAllServiceService';
import { FindServiceByIdService } from '../service/Service/FindServiceByIdService';
import { FindBreakfastServiceService } from '../service/Service/FindBreakfastServiceService';
import { UpdateServiceService } from '../service/Service/UpdateServiceService';
import { DeleteServiceService } from '../service/Service/DeleteServiceService';
import { IFilter } from '../domain/IFilter';
import { IPagination } from '../domain/IPagination';
import { SystemMessages } from '../enum/SystemMessages';

export class PaymentController {
    private logger = debug('payment-api:PaymentController');
    private createServiceService = new CreateServiceService();
    private findAllServiceService = new FindAllServiceService();
    private findServiceByIdService = new FindServiceByIdService();
    private findBreakfastServiceService = new FindBreakfastServiceService();
    private updateServiceService = new UpdateServiceService();
    private deleteServiceService = new DeleteServiceService();

    public create = async (req: Request, res: Response) => {
        this.logger(`${SystemMessages.CREATE_CONTROLLER} service`, req.body);

        const data = await this.createServiceService.execute(req.body);

        if (data instanceof Error) {
            this.logger(SystemMessages.ERROR, data.message);
            return res
                .status(422)
                .json({ [SystemMessages.ERROR]: data.message });
        }

        return res.status(200).json(data);
    };

    public getAll = async (req: Request, res: Response) => {
        this.logger(`${SystemMessages.FIND_ALL_CONTROLLER} services`);

        const filter = <IFilter>{
            hasSchedule: req.query.hasSchedule,
            search: req.query.search,
            order: req.query.order,
            idEnterprise: req.query.idEnterprise,
            filterStatus: req.query.filter_status === 'true' ? true : false,
            language: req.query.language,
        };

        const pagination = <IPagination>{
            page_size: req.query.page_size,
            current_page: req.query.current_page,
        };

        const data = await this.findAllServiceService.execute(
            filter,
            pagination,
        );

        if (data instanceof Error) {
            this.logger({ [SystemMessages.ERROR]: data.message });
            return res
                .status(422)
                .json({ [SystemMessages.ERROR]: data.message });
        }

        return res.status(200).json(data);
    };

    public getById = async (req: Request, res: Response) => {
        this.logger(
            `${SystemMessages.FIND_BY_CONTROLLER} service id ${req.params.id}`,
        );

        const data = await this.findServiceByIdService.execute(
            Number(req.params.id),
        );

        if (data instanceof Error) {
            this.logger(SystemMessages.ERROR, data.message);
            return res
                .status(422)
                .json({ [SystemMessages.ERROR]: data.message });
        }

        return res.status(200).json(data);
    };

    public getBreakfast = async (req: Request, res: Response) => {
        this.logger(
            `${SystemMessages.FIND_BY_CONTROLLER} breakfast idEnterprise ${req.params.idEnterprise}`,
        );

        const data = await this.findBreakfastServiceService.execute(
            Number(req.params.idEnterprise),
        );

        if (data instanceof Error) {
            this.logger(SystemMessages.ERROR, data.message);
            return res
                .status(422)
                .json({ [SystemMessages.ERROR]: data.message });
        }

        return res.status(200).json(data);
    };

    public update = async (req: Request, res: Response) => {
        this.logger(`${SystemMessages.UPDATE_CONTROLLER} service`, req.body);

        const data = await this.updateServiceService.execute(req.body);

        if (data instanceof Error) {
            this.logger(SystemMessages.ERROR, data.message);
            return res
                .status(422)
                .json({ [SystemMessages.ERROR]: data.message });
        }

        return res.status(200).json(data);
    };

    public delete = async (req: Request, res: Response) => {
        this.logger(
            `${SystemMessages.DELETE_CONTROLLER} service id ${req.params.id}`,
        );

        const data = await this.deleteServiceService.execute(
            Number(req.params.id),
        );

        if (data instanceof Error) {
            this.logger(SystemMessages.ERROR, data.message);
            return res
                .status(422)
                .json({ [SystemMessages.ERROR]: data.message });
        }

        return res.status(200).json(data);
    };
}
