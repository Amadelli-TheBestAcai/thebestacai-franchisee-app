import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

type Response = {
  isConnected: boolean
  sales: {
    id: number
    quantity: number
    change_amount: string
    type: number
    discount: string
    nfce_ref: string
    created_at: string
    deleted_at: string
    item: {
      id: number
      store_product_id: number
      product_id: {
        id: number
        name: string
        category_id: number
        category: {
          id: number
          name: string
          sort: number
          created_at: string
          deleted_at: string
        }
        price_buy: string
        permission_store: boolean
        permission_order: boolean
        permission_purchase: boolean
        cod_product: string
        cod_ncm: string
        brand: string
        unity: string
        weight: string
        price_sell: string
        description: string
        created_at: string
        deleted_at: string
      }
      quantity: string
      created_at: string
      deleted_at: string
    }[]
    total_sold: number
    payments: [
      {
        id: number
        amount: string
        type: number
        created_at: string
        deleted_at: string
      }[]
    ]
  }[]
}

class GetSalesFromApiService {
  private _storeCashRepository: IStoreCashRepository

  constructor(
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeCashRepository
  }

  async execute(withClosedCash = false): Promise<Response> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        isConnected,
        sales: [],
      }
    }
    const currentCash = await this._storeCashRepository.getOne()

    if (!currentCash) {
      return {
        isConnected,
        sales: [],
      }
    }

    if (!withClosedCash && !currentCash?.is_opened) {
      return {
        isConnected,
        sales: [],
      }
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return {
        isConnected,
        sales: [],
      }
    }
    const {
      data: {
        data: { sales },
      },
    } = await api.get(`/current_sales_history/${store_id}-${code}`)
    return {
      isConnected,
      sales,
    }
  }
}

export default new GetSalesFromApiService()
