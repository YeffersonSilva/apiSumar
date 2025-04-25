import { randomUUID } from 'crypto';
import { IdService } from '../../domain/services/id.service';

export class UuidService implements IdService {
  generate(): string {
    return randomUUID();
  }
}
