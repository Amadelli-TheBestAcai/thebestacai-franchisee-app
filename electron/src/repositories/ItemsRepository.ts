import knex from '../database'
import { Item } from '../models/Item'
import { CreateItemDTO } from '../models/dtos/items/CreateItemDTO'
class ItemsRepository {
  async create(item: CreateItemDTO): Promise<void> {
    return await knex('items').insert(item)
  }

  async update(id: number, payload: CreateItemDTO): Promise<void> {
    await knex('items').where({ id }).update(payload)
  }

  async getByProductAndSale(
    product_id: number,
    sale_id: string
  ): Promise<Item> {
    const items = await knex('items').where({ product_id, sale_id })
    return items[0]
  }

  async getBySale(sale_id: string): Promise<Item[]> {
    return knex('items').where({ sale_id })
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await knex('items').where({ sale_id }).del()
  }
}

export default new ItemsRepository()
