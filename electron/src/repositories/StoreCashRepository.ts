import { Repository, getRepository, DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import StoreCash from '../models/entities/StoreCash'

import { IStoreCashRepository } from './interfaces/IStoreCashRepository'

class StoreCashRepository implements IStoreCashRepository {
  private ormRepository: Repository<StoreCash>

  constructor() {
    this.ormRepository = getRepository(StoreCash)
  }

  async create(payload: DeepPartial<StoreCash>): Promise<StoreCash> {
    const storeCash = await this.ormRepository.create(payload)
    await this.ormRepository.save(storeCash)
    return storeCash
  }

  async getOne(): Promise<StoreCash> {
    return await this.ormRepository.findOne()
  }

  async softDelete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id)
  }

  async update(
    id: string,
    payload: QueryDeepPartialEntity<StoreCash>
  ): Promise<void> {
    await this.ormRepository.update(id, payload)
  }
}

export default StoreCashRepository
