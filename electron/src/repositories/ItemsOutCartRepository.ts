import { Repository, getRepository, DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import ItemOutCart from '../models/entities/ItemOutCart'
import { IItemOutCartRepository } from './interfaces/IItemOutCartRepository'

class ItemsOutCartRepository implements IItemOutCartRepository {
  private ormRepository: Repository<ItemOutCart>

  constructor() {
    this.ormRepository = getRepository(ItemOutCart)
  }

  async create(payload: DeepPartial<ItemOutCart>): Promise<ItemOutCart> {
    const itemOutCart = await this.ormRepository.create(payload)
    await this.ormRepository.save(itemOutCart)
    return itemOutCart
  }

  async getAllToIntegrate(): Promise<ItemOutCart[]> {
    return await this.ormRepository.find({ where: { integrated: false } })
  }

  async update(
    id: string,
    payload: QueryDeepPartialEntity<ItemOutCart>
  ): Promise<void> {
    await this.ormRepository.update(id, payload)
  }
}

export default ItemsOutCartRepository
