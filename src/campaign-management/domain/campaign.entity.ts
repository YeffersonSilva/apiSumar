import { UuidService } from '../../shared/services/uuid.service';

export enum CampaignType {
  DONATION = 'DONATION',
  CROWDFUNDING = 'CROWDFUNDING',
}

export enum CampaignCategory {
  EDUCATION = 'EDUCATION',
  HEALTH = 'HEALTH',
  ENVIRONMENT = 'ENVIRONMENT',
  ANIMALS = 'ANIMALS',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

export interface CampaignProps {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  ownerId: string;
  type: CampaignType;
  category: CampaignCategory;
  status: CampaignStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Campaign {
  private readonly props: CampaignProps;

  private constructor(props: CampaignProps) {
    this.props = props;
  }

  public static create(
    title: string,
    description: string,
    goalAmount: number,
    ownerId: string,
    type: CampaignType,
    category: CampaignCategory,
    idService: UuidService,
  ): Campaign {
    return new Campaign({
      id: idService.generate(),
      title,
      description,
      goalAmount,
      currentAmount: 0,
      ownerId,
      type,
      category,
      status: CampaignStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static fromProps(props: CampaignProps): Campaign {
    return new Campaign(props);
  }

  // Getters
  public getId(): string {
    return this.props.id;
  }

  public getTitle(): string {
    return this.props.title;
  }

  public getDescription(): string {
    return this.props.description;
  }

  public getGoalAmount(): number {
    return this.props.goalAmount;
  }

  public getCurrentAmount(): number {
    return this.props.currentAmount;
  }

  public getOwnerId(): string {
    return this.props.ownerId;
  }

  public getType(): CampaignType {
    return this.props.type;
  }

  public getCategory(): CampaignCategory {
    return this.props.category;
  }

  public getStatus(): CampaignStatus {
    return this.props.status;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  // Métodos de negocio
  public addContribution(amount: number): void {
    if (amount <= 0) {
      throw new Error('La contribución debe ser mayor a 0');
    }

    if (this.props.status === CampaignStatus.CLOSED) {
      throw new Error(
        'No se pueden agregar contribuciones a una campaña cerrada',
      );
    }

    this.props.currentAmount += amount;
    this.props.updatedAt = new Date();

    // Si es una campaña de donación, verificar si alcanzó la meta
    if (
      this.props.type === CampaignType.DONATION &&
      this.props.currentAmount >= this.props.goalAmount
    ) {
      this.closeCampaign();
    }
  }

  public closeCampaign(): void {
    if (this.props.status === CampaignStatus.CLOSED) {
      throw new Error('La campaña ya está cerrada');
    }

    this.props.status = CampaignStatus.CLOSED;
    this.props.updatedAt = new Date();
  }

  public reopenCampaign(): void {
    if (this.props.status === CampaignStatus.ACTIVE) {
      throw new Error('La campaña ya está activa');
    }

    this.props.status = CampaignStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  public updateDetails(
    title?: string,
    description?: string,
    goalAmount?: number,
    category?: CampaignCategory,
  ): void {
    if (this.props.status === CampaignStatus.CLOSED) {
      throw new Error(
        'No se pueden modificar los detalles de una campaña cerrada',
      );
    }

    if (title) this.props.title = title;
    if (description) this.props.description = description;
    if (goalAmount) this.props.goalAmount = goalAmount;
    if (category) this.props.category = category;

    this.props.updatedAt = new Date();
  }

  public toJSON(): CampaignProps {
    return { ...this.props };
  }
}
