import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoresRepository from '../../repositories/StoresRepository'
import { Store } from '../../models/entities'

class GetCurrentStoreService {
  private _storeRepository: IStoreRepository
  constructor(storeRepository: IStoreRepository = new StoresRepository()) {
    this._storeRepository = storeRepository
  }

  async execute(): Promise<Store> {
    return this._storeRepository.findCurrent()
  }
}

export default new GetCurrentStoreService()
