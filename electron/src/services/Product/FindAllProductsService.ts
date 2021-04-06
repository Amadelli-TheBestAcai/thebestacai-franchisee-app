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
    const hasInternet = await checkInternet()
    if (!hasInternet) {
      return []
    }
    const {
      data: { content },
    } = await api.get('/product_categories/products/purchases')

    return content
  }
}

export default new FindAllProductsService()
