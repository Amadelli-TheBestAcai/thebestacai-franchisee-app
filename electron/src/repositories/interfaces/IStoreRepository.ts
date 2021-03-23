import { DeepPartial } from 'typeorm'
import Store from '../../models/entities/Store'

export interface IStoreRepository {
  create(payload: DeepPartial<Store>): Promise<Store>

  findCurrent(): Promise<Store>
}
