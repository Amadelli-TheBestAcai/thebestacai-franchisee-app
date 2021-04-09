import { Repository, getRepository, DeepPartial } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { IItemsRepository } from './interfaces/IItemsRepository'
import { Item } from '../models/entities'

class ItemsRepository implements IItemsRepository {
  private ormRepository: Repository<Item>

  constructor() {
    this.ormRepository = getRepository(Item)
  }

  async create(payload: DeepPartial<Item>): Promise<Item> {
    const item = await this.ormRepository.create(payload)
    await this.ormRepository.save(item)
    return item
  }

  async update(
    id: string,
    payload: QueryDeepPartialEntity<Item>
  ): Promise<void> {
    await this.ormRepository.update({ id }, payload)
  }

  async updateBySale(
    sale_id: string,
    payload: QueryDeepPartialEntity<Item>
  ): Promise<void> {
    await this.ormRepository.update({ sale_id }, payload)
  }

  async updateByProductAndSale(
    product_id: number,
    sale_id: string,
    payload: QueryDeepPartialEntity<Item>
  ): Promise<void> {
    await this.ormRepository.update({ sale_id, product_id }, payload)
  }

  async getByProductAndSale(
    product_id: number,
    sale_id: string
  ): Promise<Item> {
    return await this.ormRepository.findOne({ where: { sale_id, product_id } })
  }

  async getBySale(sale_id: string): Promise<Item[]> {
    return await this.ormRepository.find({ where: { sale_id } })
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await this.ormRepository.softDelete({ sale_id })
  }

  async findById(id: string): Promise<Item> {
    return await this.ormRepository.findOne({ id })
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.softDelete({ id })
  }
}

export default new ItemsRepository()
