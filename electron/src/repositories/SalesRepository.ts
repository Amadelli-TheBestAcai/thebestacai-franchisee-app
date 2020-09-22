import knex from '../database'
import { Sale } from '../models/Sale'
class SalesRepository {
  async create(sales: Sale): Promise<void> {
    return await knex('sales').insert(sales)
  }

  async deleteById(id: string): Promise<void> {
    await knex('sales').where({ id }).del()
  }

  async getAll(): Promise<Sale[]> {
    return await knex('sales')
  }
}

export default new SalesRepository()
