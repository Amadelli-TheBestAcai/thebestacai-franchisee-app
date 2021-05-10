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

  async execute(salesToIntegrate, appSalesId): Promise<void> {
    const currentCash = await this._storeCashRepository.getOne()

    if (!currentCash || !currentCash?.is_opened) {
      throw new Error('Caixa fechado')
    }

    const { store_id } = currentCash
    if (!store_id) {
      throw new Error('Id da loja não encontrado')
    }

    const { history_id } = currentCash
    if (!store_id) {
      throw new Error('Histórico não encontrado')
    }

    salesToIntegrate.reduce((previousPromise, nextSale) => {
      return previousPromise.then(async () => {
        return await api.post(`/sales/${store_id}-${currentCash.code}`, [
          nextSale,
        ])
      })
    }, Promise.resolve())

    await api.post('/app_sale/integrate', {
      historyId: history_id,
      payload: appSalesId,
    })
  }
}

export default new IntegrateAppSalesService()
