import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'
import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { CloseCashierDTO } from '../../models/dtos/Cashier/CloseCashierDTO'

class OpenStoreCashService {
  private _storeCashRepository: IStoreCashRepository
  constructor(
    storeRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeRepository
  }

  async execute({ code, amount_on_close }: CloseCashierDTO): Promise<void> {
    const isConnected = await checkInternet()
    const { store_id: store, id } = await this._storeCashRepository.getOne()
    if (isConnected) {
      await api.put(`/store_cashes/${store}-${code}/close`, { amount_on_close })
    }
    await this._storeCashRepository.update(id, { is_opened: false })
  }
}

export default new OpenStoreCashService()
