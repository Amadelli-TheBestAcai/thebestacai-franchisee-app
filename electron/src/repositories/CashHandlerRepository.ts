import { Repository, getRepository, DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import CashHandler from '../models/entities/CashHandler'

import { ICashHandlerRepository } from './interfaces/ICashHandlerRepository'

class CashHandlerRepository implements ICashHandlerRepository {
  private ormRepository: Repository<CashHandler>

  constructor() {
    this.ormRepository = getRepository(CashHandler)
  }

  async create(payload: DeepPartial<CashHandler>): Promise<CashHandler> {
    const cashHandler = await this.ormRepository.create(payload)
    await this.ormRepository.save(cashHandler)
    return cashHandler
  }

  async update(
    id: string,
    payload: QueryDeepPartialEntity<CashHandler>
  ): Promise<void> {
    await this.ormRepository.update(id, payload)
  }

  async getOfflineHandlers(): Promise<CashHandler[]> {
    return await this.ormRepository
      .createQueryBuilder('cash_handlers')
      .where('cash_handlers.cash_history_id IS NULL')
      .getMany()
  }

  async getOnlineHandlers(): Promise<CashHandler[]> {
    return await this.ormRepository
      .createQueryBuilder('cash_handlers')
      .where('cash_handlers.cash_history_id IS NOT NULL')
      .getMany()
  }
}

export default CashHandlerRepository
