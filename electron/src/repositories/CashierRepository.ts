import knex from '../database'
import { Cashier } from '../models/Cashier'
import { CreateCashierDTO } from '../models/dtos/Cashier/CreateCashierDTO'
import { UpdateCashierDTO } from '../models/dtos/Cashier/UpdateCashierDTO'
import { v4 } from 'uuid'

class CashierRepository {
  async create(payload: CreateCashierDTO): Promise<void> {
    return await knex('store_cashes').insert({ id: v4(), ...payload })
  }

  async delete(): Promise<void> {
    await knex('store_cashes').del()
  }

  async findAndUpdate(id: number, payload: UpdateCashierDTO): Promise<void> {
    await knex('store_cashes').where({ id }).update(payload)
  }

  async get(): Promise<Cashier> {
    const cashes = await knex('store_cashes')
    return cashes[0]
  }
}

export default new CashierRepository()
