import knex from '../database'
import { Sale } from '../models/Sale'
import { CreateSaleDTO } from '../models/dtos/sales/CreateSaleDTO'
import { UpdateSaleDTO } from '../models/dtos/sales/UpdateSaleDTO'
class SalesRepository {
  async create(sales: CreateSaleDTO): Promise<void> {
    await knex('sales').insert(sales)
  }

  async deleteById(id: string): Promise<void> {
    await knex('sales').where({ id }).del()
  }

  async getCurrentSale(): Promise<CreateSaleDTO> {
    const sales = await knex('sales').where({ is_current: true })
    return sales[0]
  }

  async getToIntegrate(): Promise<Sale[]> {
    return await knex('sales')
      .where({ to_integrate: true })
      .whereNotNull('cash_history_id')
  }

  async getPending(): Promise<Sale[]> {
    return await knex('sales')
      .where({ to_integrate: true })
      .whereNull('cash_history_id')
  }

  async update(id: string, payload: UpdateSaleDTO): Promise<void> {
    await knex('sales').where({ id }).update(payload)
  }

  async getCommands(): Promise<Sale[]> {
    return await knex('sales').where({ to_integrate: false })
  }

  async createCommand(id: string, name: string): Promise<void> {
    await knex('sales').where({ id }).update({ is_current: false, name })
  }

  async getById(id: string): Promise<Sale> {
    return await knex('sales').where({ id })
  }
}

export default new SalesRepository()
