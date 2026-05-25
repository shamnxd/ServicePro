import { Request, Response, NextFunction } from "express";
import { inject, autoInjectable } from "tsyringe";
import { IUseCase } from "../interfaces/usecases/IUseCase";
import { ISMR } from "../interfaces/models/ISMR";
import { CreateSMRDto, UpdateSMRDto } from "../dtos/smr.dto";
import { SMRApprovalInput } from "../usecases/smrs/ApproveSMRUseCase";
import { StatusCode } from "../constants/statusCodes";

@autoInjectable()
export class SMRController {
  constructor(
    @inject("CreateSMRUseCase")
    private _createSMRUseCase?: IUseCase<CreateSMRDto, ISMR>,
    @inject("GetSMRByIdUseCase")
    private _getSMRByIdUseCase?: IUseCase<string, ISMR | null>,
    @inject("GetSMRsByComplaintUseCase")
    private _getSMRsByComplaintUseCase?: IUseCase<string, ISMR[]>,
    @inject("UpdateSMRUseCase")
    private _updateSMRUseCase?: IUseCase<{ id: string; data: UpdateSMRDto }, ISMR | null>,
    @inject("ApproveSMRUseCase")
    private _approveSMRUseCase?: IUseCase<SMRApprovalInput, ISMR | null>
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateSMRDto;
      const smr = await this._createSMRUseCase!.execute(dto);
      res.status(StatusCode.CREATED).json({
        success: true,
        data: smr
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const smr = await this._getSMRByIdUseCase!.execute(req.params.id);
      if (!smr) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: "SMR not found" });
        return;
      }
      res.status(StatusCode.OK).json({ success: true, data: smr });
    } catch (error) {
      next(error);
    }
  };

  public getByComplaintId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const complaintId = req.query.complaintId as string;
      if (!complaintId) {
        res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "complaintId query param is required" });
        return;
      }
      const smrs = await this._getSMRsByComplaintUseCase!.execute(complaintId);
      res.status(StatusCode.OK).json({
        success: true,
        data: smrs
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const dto = req.body as UpdateSMRDto;
      const smr = await this._updateSMRUseCase!.execute({ id, data: dto });
      if (!smr) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: "SMR not found" });
        return;
      }
      res.status(StatusCode.OK).json({
        success: true,
        data: smr
      });
    } catch (error) {
      next(error);
    }
  };

  public approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const { clientRepName } = req.body;

      if (!clientRepName) {
        res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Client representative name is required"
        });
        return;
      }

      const smr = await this._approveSMRUseCase!.execute({
        id,
        clientRepName
      });

      if (!smr) {
        res.status(StatusCode.NOT_FOUND).json({ success: false, message: "SMR not found" });
        return;
      }

      res.status(StatusCode.OK).json({
        success: true,
        data: smr
      });
    } catch (error) {
      next(error);
    }
  };
}
