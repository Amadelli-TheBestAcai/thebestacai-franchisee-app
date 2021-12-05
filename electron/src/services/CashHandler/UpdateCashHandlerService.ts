import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { ICashHandlerRepository } from '../../repositories/interfaces/ICashHandlerRepository'
import CashHandlerRepository from '../../repositories/CashHandlerRepository'
import { CashHandler } from '../../models/entities'

class UpdateCashHandlerService {
  private _cashHandlerRepository: ICashHandlerRepository
  constructor(
    storeCashRepository: ICashHandlerRepository = new CashHandlerRepository()
  ) {
    this._cashHandlerRepository = storeCashRepository
  }

  async execute(
    id: string,
    payload: QueryDeepPartialEntity<CashHandler>
  ): Promise<void> {
    await this._cashHandlerRepository.update(id, payload)
  }
}

export default new UpdateCashHandlerService()
