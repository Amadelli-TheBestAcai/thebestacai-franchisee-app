import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import StoreCash from '../../models/entities/StoreCash'

class GetCurrentStoreCashService {
  private _storeCashRepository: IStoreCashRepository
  constructor(
    storeRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeRepository
  }

  async execute(): Promise<StoreCash> {
    return await this._storeCashRepository.getOne()
  }
}

export default new GetCurrentStoreCashService()
