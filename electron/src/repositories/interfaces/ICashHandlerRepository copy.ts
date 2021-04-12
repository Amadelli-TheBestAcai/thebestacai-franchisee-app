import { DeepPartial } from 'typeorm'
import CashHandler from '../../models/entities/CashHandler'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export interface ICashHandlerRepository {
  create(payload: DeepPartial<CashHandler>): Promise<CashHandler>
  update(
    id: string,
    payload: QueryDeepPartialEntity<CashHandler>
  ): Promise<void>
  getOfflineHandlers(): Promise<CashHandler[]>
  getOnlineHandlers(): Promise<CashHandler[]>
}
