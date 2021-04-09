import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import StoreCash from '../../models/entities/StoreCash'

export interface IStoreCashRepository {
  create(payload: DeepPartial<StoreCash>): Promise<StoreCash>
  softDelete(id: string): Promise<void>
  getOne(): Promise<StoreCash>
  update(id: string, payload: QueryDeepPartialEntity<StoreCash>): Promise<void>
}
