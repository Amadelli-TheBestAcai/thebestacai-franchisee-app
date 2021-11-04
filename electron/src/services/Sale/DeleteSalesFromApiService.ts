import api from '../../utils/ApiSalesHandler'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

class DeleteSalesFromApiService {
  private _storeCashRepository: IStoreCashRepository

  constructor(
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeCashRepository
  }

  async execute(id: number): Promise<boolean> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return false
    }

    const currentCash = await this._storeCashRepository.getOne()
    if (!currentCash || !currentCash?.is_opened) {
      return false
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return false
    }

    await api.delete(`/sales/${id}`)

    return true
  }
}

export default new DeleteSalesFromApiService()
