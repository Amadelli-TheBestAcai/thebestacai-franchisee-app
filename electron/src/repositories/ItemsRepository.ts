import knex from '../database'
import { Item } from '../models/Item'
import { CreateItemDTO } from '../models/dtos/items/CreateItemDTO'
class ItemsRepository {
  async create(items: CreateItemDTO[]): Promise<void> {
    return await knex('items').insert(items)
  }

  async getBySale(sale_id: string): Promise<Item[]> {
    return knex('items').where({ sale_id })
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await knex('items').where({ sale_id }).del()
  }
}

export default new ItemsRepository()
