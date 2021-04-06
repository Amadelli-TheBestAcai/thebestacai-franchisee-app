import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

type Response = {
  id: number
  name: string
  sort: number
  products: {
    id: number
    name: string
    category_id: number
    price_buy: string
    permission_store: boolean
    permission_order: boolean
    cod_product: string
    cod_ncm: string
    brand: string
    unity: number
    weight: string
    price_sell: string
    created_at: string
    deleted_at: string
  }[]
}

class FindAllCategoriesWithProductsService {
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

export default new FindAllCategoriesWithProductsService()
