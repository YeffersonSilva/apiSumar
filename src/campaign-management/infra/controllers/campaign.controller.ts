import { Request, Response } from 'express';
import {
  CreateCampaignUseCase,
  CreateCampaignDto,
} from '../../application/use-cases/create-campaign.use-case';
import { ListCampaignsUseCase } from '../../application/use-cases/list-campaigns.use-case';
import { CampaignType, CampaignCategory } from '../../domain/campaign.entity';
import { UnauthorizedError } from '../../../shared/errors/http-error';

export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly listCampaignsUseCase: ListCampaignsUseCase,
  ) {}

  async createCampaign(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.user?.sub) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const dto: CreateCampaignDto = {
        title: req.body.title,
        description: req.body.description,
        goalAmount: req.body.goalAmount,
        ownerId: req.user.sub,
        type: req.body.type as CampaignType,
        category: req.body.category as CampaignCategory,
      };

      const campaign = await this.createCampaignUseCase.execute(dto);

      return res.status(201).json({
        success: true,
        data: campaign.toJSON(),
      });
    } catch (error) {
      // El error será manejado por el middleware global de errores
      throw error;
    }
  }

  async listCampaigns(req: Request, res: Response): Promise<Response> {
    try {
      const campaigns = await this.listCampaignsUseCase.execute();

      return res.status(200).json({
        success: true,
        data: campaigns.map((campaign) => campaign.toJSON()),
      });
    } catch (error) {
      // El error será manejado por el middleware global de errores
      throw error;
    }
  }
}
