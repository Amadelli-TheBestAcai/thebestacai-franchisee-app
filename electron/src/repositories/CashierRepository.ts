import knex from '../database'
import { Cashier } from '../models/Cashier'
import { CreateCashierDTO } from '../models/dtos/Cashier/CreateCashierDTO'
import { UpdateCashierDTO } from '../models/dtos/Cashier/UpdateCashierDTO'

class CashierRepository {
  async create(payload: CreateCashierDTO): Promise<void> {
    return await knex('cashier').insert(payload)
  }

  async delete(): Promise<void> {
    await knex('cashier').del()
  }

  async findAndUpdate(id: number, payload: UpdateCashierDTO): Promise<void> {
    await knex('cashier').where({ id }).update(payload)
  }

  async get(): Promise<Cashier> {
    const cashes = await knex('cashier')
    return cashes[0]
  }
}

export default new CashierRepository()
