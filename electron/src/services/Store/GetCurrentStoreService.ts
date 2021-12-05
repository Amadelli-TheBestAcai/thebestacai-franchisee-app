import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'
import { Store } from '../../models/entities'

class GetCurrentStoreService {
  private _storeRepository: IStoreRepository
  constructor(storeRepository: IStoreRepository = new StoreRepository()) {
    this._storeRepository = storeRepository
  }

  async execute(): Promise<Store> {
    return this._storeRepository.findCurrent()
  }
}

export default new GetCurrentStoreService()
