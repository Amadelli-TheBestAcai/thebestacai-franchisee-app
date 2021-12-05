import { DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import ItemOutCart from '../../models/entities/ItemOutCart'

export interface IItemOutCartRepository {
  create(payload: DeepPartial<ItemOutCart>): Promise<ItemOutCart>
  getAllToIntegrate(): Promise<ItemOutCart[]>
  update(
    id: string,
    payload: QueryDeepPartialEntity<ItemOutCart>
  ): Promise<void>
}
