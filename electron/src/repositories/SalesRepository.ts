import knex from '../database'
import { Sale } from '../models/Sale'
import { CreateSaleDTO } from '../models/dtos/CreateSaleDTO'
class SalesRepository {
  async create(sales: Sale): Promise<void> {
    return await knex('sales').insert(sales)
  }

  async deleteById(id: string): Promise<void> {
    await knex('sales').where({ id }).del()
  }

  async getCurrentSale(): Promise<CreateSaleDTO> {
    const sales = await knex('sales').where({ is_current: true })
    return sales[0]
  }

  async getToIntegrate(): Promise<Sale[]> {
    return await knex('sales').where({ to_integrate: true })
  }

  async update(id: string, payload: CreateSaleDTO): Promise<void> {
    await knex('sales').where({ id }).update(payload)
  }

  async getCommands(): Promise<Sale[]> {
    return await knex('sales').where({ to_integrate: false })
  }
}

export default new SalesRepository()
