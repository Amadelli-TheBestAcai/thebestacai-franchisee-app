import api from '../../utils/Api'

import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

class UpdateStoreCashObservationService {
  private _storeCashRepository: IStoreCashRepository
  constructor(
    storeRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeRepository
  }

  async execute(observation: string): Promise<void> {
    const { history_id } = await this._storeCashRepository.getOne()
    await api.put(`/cash_history/${history_id}`, { observation })
  }
}

export default new UpdateStoreCashObservationService()
