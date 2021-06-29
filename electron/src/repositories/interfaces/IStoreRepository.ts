import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import Store from '../../models/entities/Store'

export interface IStoreRepository {
  create(payload: DeepPartial<Store>): Promise<Store>
  findCurrent(): Promise<Store>
  findCurrentAndUpdate(payload: QueryDeepPartialEntity<Store>): Promise<void>
}
