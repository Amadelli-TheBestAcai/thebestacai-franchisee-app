import api from '../../utils/ApiAuth'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

class CreateStoreService {
  private _storeRepository: IStoreRepository
  constructor(storeRepository: IStoreRepository = new StoreRepository()) {
    this._storeRepository = storeRepository
  }

  async execute(storeId: number): Promise<void> {
    const isOnline = await checkInternet()
    if (isOnline) {
      const store = await this._storeRepository.findCurrent()
      if (!store) {
        const {
          data: {
            content: {
              id: store_id,
              cnpj,
              company_name,
              token_nfce_production,
            },
          },
        } = await api.get(`/company/${storeId}`)

        await this._storeRepository.create({
          store_id,
          cnpj,
          company_name,
          token_nfce: token_nfce_production,
        })
      }
    }
  }
}

export default new CreateStoreService()
