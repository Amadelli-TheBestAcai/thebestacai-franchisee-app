import api from '../../utils/Api'

import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

class IntegrateAppSalesService {
  private _storeCashRepository: IStoreCashRepository

  constructor(
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeCashRepository
  }

  async execute(payload): Promise<void> {
    const currentCash = await this._storeCashRepository.getOne()

    if (!currentCash || !currentCash?.is_opened) {
      throw new Error('Caixa fechado')
    }

    const { store_id } = currentCash
    if (!store_id) {
      throw new Error('Id da loja não encontrado')
    }

    await api.post(`/sales/${store_id}-${currentCash.code}`, payload)
  }
}

export default new IntegrateAppSalesService()
