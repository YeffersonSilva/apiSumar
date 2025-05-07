import { Router } from 'express';
import { CampaignController } from '../infra/controllers/campaign.controller';
import { CreateCampaignUseCase } from '../application/use-cases/create-campaign.use-case';
import { ListCampaignsUseCase } from '../application/use-cases/list-campaigns.use-case';
import { PrismaCampaignRepository } from '../infra/prisma/campaign.repository';
import { UuidService } from '../../shared/services/uuid.service';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

export function createCampaignRoutes(): Router {
  const router = Router();

  // Inicializar dependencias
  const campaignRepository = new PrismaCampaignRepository();
  const idService = new UuidService();

  // Inicializar casos de uso
  const createCampaignUseCase = new CreateCampaignUseCase(
    campaignRepository,
    idService,
  );
  const listCampaignsUseCase = new ListCampaignsUseCase(campaignRepository);

  // Inicializar controlador
  const campaignController = new CampaignController(
    createCampaignUseCase,
    listCampaignsUseCase,
  );

  // Rutas públicas
  router.get('/', (req, res) => campaignController.listCampaigns(req, res));

  // Rutas protegidas
  router.post('/', authMiddleware, (req, res) =>
    campaignController.createCampaign(req, res),
  );

  return router;
}
