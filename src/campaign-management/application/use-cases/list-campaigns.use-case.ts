import { Campaign } from '../../domain/campaign.entity';
import { CampaignRepositoryPort } from '../../domain/interfaces/campaign.repository.interface';

export class ListCampaignsUseCase {
  constructor(private readonly campaignRepository: CampaignRepositoryPort) {}

  async execute(): Promise<Campaign[]> {
    return this.campaignRepository.findAll();
  }
}
