import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import Settings from '../../models/entities/Settings'

export interface ISettingRepository {
  create(payload: DeepPartial<Settings>): Promise<Settings>
  update(id: string, payload: QueryDeepPartialEntity<Settings>): Promise<void>
  getOne(): Promise<Settings>
}
