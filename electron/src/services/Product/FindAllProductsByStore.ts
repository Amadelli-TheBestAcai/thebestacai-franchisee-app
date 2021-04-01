import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

type Response = {
  id: number
  product_id: number
  product: {
    id: number
    name: string
    category_id: number
    category: {
      id: number
      name: string
      created_at: string
      deleted_at: string
    }
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
  }
  store_id: number
  price_unit: string
  permission: false
  price_sell: string
  unity: string
  unity_taxable: string
  price_taxable: string
  cfop: string
  icms_origin: string
  icms_tax_situation: string
  tax_regime: string
  pis_tax_situation: string
  pis_aliquot_value: string
  pis_aliquot_percentage: string
  cofins_tax_situation: string
  cofins_aliquot_value: string
  cofins_aliquot_percentage: string
  additional_information: string
  price_permission: boolean
  quantity: string
  created_at: string
  deleted_at: string
}

class FindAllProductsByStore {
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

export default new FindAllProductsByStore()
