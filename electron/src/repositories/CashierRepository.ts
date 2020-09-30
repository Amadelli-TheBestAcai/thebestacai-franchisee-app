import knex from '../database'
import { Cashier } from '../models/Cashier'
import { CreateCashierDTO } from '../models/dtos/Cashier/CreateCashierDTO'

class CashierRepository {
  async create(payload: CreateCashierDTO): Promise<void> {
    return await knex('cashier').insert(payload)
  }

  async delete(): Promise<void> {
    return await knex('cashier').del()
  }

  async get(): Promise<Cashier> {
    const cashes = await knex('cashier')
    return cashes[0]
  }
}

export default new CashierRepository()
