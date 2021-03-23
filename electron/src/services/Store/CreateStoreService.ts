import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoresRepository from '../../repositories/StoresRepository'

class CreateStoreService {
  private _storeRepository: IStoreRepository
  constructor(storeRepository: IStoreRepository = new StoresRepository()) {
    this._storeRepository = storeRepository
  }

  async execute(storeId: number): Promise<void> {
    const isOnline = await checkInternet()
    if (isOnline) {
      const store = await this._storeRepository.findCurrent()
      if (!store) {
        const {
          data: {
            data: { id, cnpj, company_name, token_nfce_production },
          },
        } = await api.get(`/stores?id=${storeId}`)

        await this._storeRepository.create({
          id,
          cnpj,
          company_name,
          token_nfce: token_nfce_production,
        })
      }
    }
  }
}

export default new CreateStoreService()
