import { Repository, getRepository, DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import Store from '../models/entities/Store'

import { IStoreRepository } from './interfaces/IStoreRepository'

class StoreRepository implements IStoreRepository {
  private ormRepository: Repository<Store>

  constructor() {
    this.ormRepository = getRepository(Store)
  }

  async create(payload: DeepPartial<Store>): Promise<Store> {
    const store = await this.ormRepository.create(payload)
    await this.ormRepository.save(store)
    return store
  }

  async findCurrent(): Promise<Store> {
    return await this.ormRepository.findOne()
  }

  async findCurrentAndUpdate(
    payload: QueryDeepPartialEntity<Store>
  ): Promise<void> {
    const store = await this.ormRepository.findOne()
    await this.ormRepository.update(store.id, payload)
  }
}

export default StoreRepository
