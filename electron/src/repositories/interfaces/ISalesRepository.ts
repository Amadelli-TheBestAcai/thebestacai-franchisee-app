import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import {
  Repository,
  getRepository,
  DeepPartial,
  EntityRepository,
  Not,
  IsNull,
} from 'typeorm'
import { Sale } from '../../models/entities'

export interface ISalesRepository {
  create(payload: DeepPartial<Sale>): Promise<Sale>
  deleteById(id: string): Promise<void>
  getCurrentSale(): Promise<Sale>
  getToIntegrate(): Promise<Sale[]>
  getOffline(): Promise<Sale[]>
  update(id: string, payload: QueryDeepPartialEntity<Sale>): Promise<void>
  getCommands(): Promise<Sale[]>
  createCommand(id: string, name: string): Promise<void>
  getById(id: string): Promise<Sale>
}
