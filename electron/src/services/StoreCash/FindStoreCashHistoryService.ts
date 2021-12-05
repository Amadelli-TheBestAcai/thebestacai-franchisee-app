import api from '../../utils/Api'
import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import StoreCash from '../../models/entities/StoreCash'

class FindStoreCashHistoryService {
  private _storeCashRepository: IStoreCashRepository
  constructor(
    storeRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeRepository
  }

  async execute(): Promise<{ cashier: StoreCash; history: any }> {
    const cashier = await this._storeCashRepository.getOne()
    if (cashier && cashier.history_id) {
      const { code, store_id } = cashier
      const {
        data: { history },
      } = await api.get(`/current_cash_history/${store_id}-${code}`)
      return {
        cashier,
        history,
      }
    } else {
      return null
    }
  }
}

export default new FindStoreCashHistoryService()
