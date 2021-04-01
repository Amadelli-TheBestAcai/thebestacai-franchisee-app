import { Repository, getRepository } from 'typeorm'
import StoreCash from '../models/entities/StoreCash'

import { IStoreCashRepository } from './interfaces/IStoreCashRepository'

class StoreCashRepository implements IStoreCashRepository {
  private ormRepository: Repository<StoreCash>

  constructor() {
    this.ormRepository = getRepository(StoreCash)
  }

  async getOne(): Promise<StoreCash> {
    return await this.ormRepository.findOne()
  }
}

export default StoreCashRepository
