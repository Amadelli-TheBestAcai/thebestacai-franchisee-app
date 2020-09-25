import knex from '../database'
import { Cashier } from '../models/Cashier'

class CashierRepository {
  async create(code: string): Promise<void> {
    return await knex('cashier').insert({ id: 1, code })
  }

  async delete(): Promise<void> {
    return await knex('cashier').del()
  }

  async get(): Promise<Cashier> {
    return await knex('cashier')[0]
  }
}

export default new CashierRepository()
