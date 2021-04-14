import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

class FindAllProductsService {
  private _storeRepository: IStoreRepository

  constructor(storeRepository: IStoreRepository = new StoreRepository()) {
    this._storeRepository = storeRepository
  }

  async execute(): Promise<Response[]> {
    const isOnline = await checkInternet()
    if (isOnline) {
      const { store_id } = await this._storeRepository.findCurrent()
      const {
        data: { content },
      } = await api.get(`/products_store/store/${store_id}?stockProducts=true`)
      return content
    } else {
      return []
    }
  }
}

export default new FindAllProductsService()
