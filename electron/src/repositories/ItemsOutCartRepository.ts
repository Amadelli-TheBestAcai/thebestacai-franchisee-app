import knex from '../database'
import { ItemOutCart } from '../models/ItemOutCart'
import { CreateItemOutCartDTO } from '../models/dtos/itemOutCart/CreateItemOutCartDTO'

class ItemsOutCartRepository {
  async create(payload: CreateItemOutCartDTO) {
    return await knex('items_out_cart').insert(payload)
  }

  async getAll(): Promise<ItemOutCart[]> {
    return await knex('items_out_cart')
  }

  async deleteById(id: number): Promise<void> {
    await knex('items_out_cart').where({ id }).del()
  }
}

export default new ItemsOutCartRepository()
