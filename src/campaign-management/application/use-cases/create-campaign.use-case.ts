import { z } from 'zod';
import {
  Campaign,
  CampaignType,
  CampaignCategory,
} from '../../domain/campaign.entity';
import { CampaignRepositoryPort } from '../../domain/interfaces/campaign.repository.interface';
import { UuidService } from '../../../shared/services/uuid.service';
import { BadRequestError } from '../../../shared/errors/http-error';

// DTO para la creación de campañas
export interface CreateCampaignDto {
  title: string;
  description: string;
  goalAmount: number;
  ownerId: string;
  type: CampaignType;
  category: CampaignCategory;
}

// Esquema de validación
const createCampaignSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  goalAmount: z.number().positive(),
  ownerId: z.string().uuid(),
  type: z.nativeEnum(CampaignType),
  category: z.nativeEnum(CampaignCategory),
});

export class CreateCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepositoryPort,
    private readonly idService: UuidService,
  ) {}

  async execute(dto: CreateCampaignDto): Promise<Campaign> {
    // Validar datos de entrada
    const result = createCampaignSchema.safeParse(dto);
    if (!result.success) {
      throw new BadRequestError('Datos de campaña inválidos', {
        errors: result.error.errors,
      });
    }

    // Crear entidad de campaña
    const campaign = Campaign.create(
      dto.title,
      dto.description,
      dto.goalAmount,
      dto.ownerId,
      dto.type,
      dto.category,
      this.idService,
    );

    // Persistir en el repositorio
    await this.campaignRepository.create(campaign);

    return campaign;
  }
}
