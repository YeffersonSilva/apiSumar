import {
  PrismaClient,
  CampaignType as PrismaCampaignType,
  CampaignCategory as PrismaCampaignCategory,
  CampaignStatus as PrismaCampaignStatus,
} from '@prisma/client';
import {
  Campaign,
  CampaignProps,
  CampaignType,
  CampaignCategory,
  CampaignStatus,
} from '../../domain/campaign.entity';
import { CampaignRepositoryPort } from '../../domain/interfaces/campaign.repository.interface';

export class PrismaCampaignRepository implements CampaignRepositoryPort {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private mapPrismaTypeToEntityType(type: PrismaCampaignType): CampaignType {
    return type as CampaignType;
  }

  private mapPrismaCategoryToEntityCategory(
    category: PrismaCampaignCategory,
  ): CampaignCategory {
    return category as CampaignCategory;
  }

  private mapPrismaStatusToEntityStatus(
    status: PrismaCampaignStatus,
  ): CampaignStatus {
    return status as CampaignStatus;
  }

  async create(campaign: Campaign): Promise<void> {
    const campaignData = campaign.toJSON();

    await this.prisma.campaign.create({
      data: {
        id: campaignData.id,
        title: campaignData.title,
        description: campaignData.description,
        goalAmount: campaignData.goalAmount,
        currentAmount: campaignData.currentAmount,
        type: campaignData.type,
        category: campaignData.category,
        status: campaignData.status,
        ownerId: campaignData.ownerId,
        createdAt: campaignData.createdAt,
        updatedAt: campaignData.updatedAt,
      },
    });
  }

  async findAll(): Promise<Campaign[]> {
    const campaigns = await this.prisma.campaign.findMany({
      include: {
        owner: true,
      },
    });

    return campaigns.map((campaign) => {
      const props: CampaignProps = {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        goalAmount: campaign.goalAmount,
        currentAmount: campaign.currentAmount,
        type: this.mapPrismaTypeToEntityType(campaign.type),
        category: this.mapPrismaCategoryToEntityCategory(campaign.category),
        status: this.mapPrismaStatusToEntityStatus(campaign.status),
        ownerId: campaign.ownerId,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      };
      return Campaign.fromProps(props);
    });
  }

  async findById(id: string): Promise<Campaign | null> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!campaign) {
      return null;
    }

    const props: CampaignProps = {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      currentAmount: campaign.currentAmount,
      type: this.mapPrismaTypeToEntityType(campaign.type),
      category: this.mapPrismaCategoryToEntityCategory(campaign.category),
      status: this.mapPrismaStatusToEntityStatus(campaign.status),
      ownerId: campaign.ownerId,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };

    return Campaign.fromProps(props);
  }
}
