import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { AppSale } from '../../../../shared/models/appSales'

type Response = {
  hasInternet: boolean
  sales: AppSale[]
}

class GetAppSalesToIntegrateService {
  private _storeCashRepository: IStoreCashRepository

  constructor(
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeCashRepository
  }

  async execute(): Promise<Response> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        hasInternet: false,
        sales: [],
      }
    }

    const currentCash = await this._storeCashRepository.getOne()
    if (!currentCash || !currentCash?.is_opened) {
      throw new Error('Caixa fechado')
    }

    const { store_id } = currentCash
    if (!store_id) {
      throw new Error('Id da loja não encontrado')
    }

    const {
      data: { content },
    } = await api.get(`/app_sale/${store_id}/toIntegrate`)

    return {
      hasInternet: true,
      sales: content,
    }
  }
}

export default new GetAppSalesToIntegrateService()
