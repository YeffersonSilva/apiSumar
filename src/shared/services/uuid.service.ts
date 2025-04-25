import { randomUUID } from 'crypto';
import { IdService } from '../../user-management/domain/interfaces/id.service.interface';

export class UuidService implements IdService {
  generate(): string {
    return randomUUID();
  }
}
