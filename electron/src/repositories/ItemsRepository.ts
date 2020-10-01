import knex from '../database'
import { Item } from '../models/Item'
import { CreateItemDTO } from '../models/dtos/items/CreateItemDTO'
import { UpdateItemDTO } from '../models/dtos/items/UpdateItemDTO'
class ItemsRepository {
  async create(item: CreateItemDTO): Promise<void> {
    return await knex('items').insert(item)
  }

  async update(id: string, payload: UpdateItemDTO): Promise<void> {
    await knex('items').where({ id }).update(payload)
  }

  async updateBySale(sale_id: string, payload: UpdateItemDTO): Promise<void> {
    await knex('items').where({ sale_id }).update(payload)
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

  async findById(id: string): Promise<Item> {
    const items = await knex('items').where({ id })
    return items[0]
  }

  async deleteById(id: string): Promise<void> {
    await knex('items').where({ id }).del()
  }
}

export default new ItemsRepository()
