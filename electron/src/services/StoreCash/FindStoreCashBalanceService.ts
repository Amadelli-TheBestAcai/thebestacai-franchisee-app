import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'
import { Balance } from '../../../../shared/models/balance'
import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { getBalance } from '../../utils/BalanceFormater'

class FindStoreCashBalanceService {
  private _storeCashRepository: IStoreCashRepository
  constructor(
    storeRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeRepository
  }

  async execute(withClosedCash = false): Promise<Balance> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return
    }
    const currentCash = await this._storeCashRepository.getOne()

    if (!currentCash) {
      return
    }

    if (!withClosedCash && !currentCash.is_opened) {
      return
    }

    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return
    }

    const {
      data: {
        data: { sales },
      },
    } = await api.get(`/current_sales_history/${store_id}-${code}`)

    return getBalance(sales)
  }
}

export default new FindStoreCashBalanceService()
