import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'
import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { CreateCashierDTO } from '../../models/dtos/Cashier/CreateCashierDTO'

class OpenStoreCashService {
  private _storeCashRepository: IStoreCashRepository
  constructor(
    storeRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeRepository
  }

  async execute({ code, amount_on_open }: CreateCashierDTO): Promise<void> {
    const isConnected = await checkInternet()
    let newCashier: CreateCashierDTO = { code, is_opened: true, amount_on_open }
    const { store_id: store, id } = await this._storeCashRepository.getOne()
    if (isConnected) {
      const {
        data: {
          data: { cash_id, history_id, store_id },
        },
      } = await api.put(`/store_cashes/${store}-${code}/open`, {
        amount_on_open,
      })
      newCashier = { cash_id, history_id, store_id, ...newCashier }
    }
    await this._storeCashRepository.softDelete(id)
    await this._storeCashRepository.create({ ...newCashier })
  }
}

export default new OpenStoreCashService()
