import {
  Repository,
  getRepository,
  DeepPartial,
  EntityRepository,
  Not,
  IsNull,
} from 'typeorm'
import { ISalesRepository } from './interfaces/ISalesRepository'
import { Sale } from '../models/entities'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@EntityRepository(Sale)
class SalesRepository implements ISalesRepository {
  private ormRepository: Repository<Sale>

  constructor() {
    this.ormRepository = getRepository(Sale)
  }

  async create(payload: DeepPartial<Sale>): Promise<Sale> {
    const sale = await this.ormRepository.create(payload)
    await this.ormRepository.save(sale)
    return sale
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.softDelete({ id })
  }

  async getCurrentSale(): Promise<Sale> {
    return this.ormRepository.findOne({ where: { is_current: true } })
  }

  async getToIntegrate(): Promise<Sale[]> {
    return this.ormRepository.find({
      where: { to_integrate: true, cash_history_id: Not(IsNull()) },
    })
  }

  async getOffline(): Promise<Sale[]> {
    return this.ormRepository.find({
      where: { to_integrate: true, cash_history_id: IsNull() },
    })
  }

  async update(
    id: string,
    payload: QueryDeepPartialEntity<Sale>
  ): Promise<void> {
    await this.ormRepository.update({ id }, payload)
  }

  async getCommands(): Promise<Sale[]> {
    const sales = await this.ormRepository.find({
      where: { name: Not(IsNull()) },
    })

    return sales.filter((sale) => !sale.is_current)
  }

  async createCommand(id: string, name: string): Promise<void> {
    await this.ormRepository.update({ id }, { is_current: false, name })
  }

  async getById(id: string): Promise<Sale> {
    return this.ormRepository.findOne({
      where: { id },
    })
  }

  async getOnline(): Promise<Sale[]> {
    return this.ormRepository.find({
      where: { to_integrate: true, cash_history_id: Not(IsNull()) },
    })
  }
}

export default SalesRepository
