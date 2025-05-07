import { Campaign } from '../campaign.entity';

export interface CampaignRepositoryPort {
  /**
   * Crea una nueva campaña en el repositorio
   * @param campaign La campaña a crear
   */
  create(campaign: Campaign): Promise<void>;

  /**
   * Obtiene todas las campañas del repositorio
   * @returns Lista de todas las campañas
   */
  findAll(): Promise<Campaign[]>;

  /**
   * Busca una campaña por su ID
   * @param id ID de la campaña a buscar
   * @returns La campaña encontrada o null si no existe
   */
  findById(id: string): Promise<Campaign | null>;
}
