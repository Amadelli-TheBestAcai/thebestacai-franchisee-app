import knex from '../database'
import { Sale } from '../models/Sale'
import { CreateSaleDTO } from '../models/dtos/CreateSaleDTO'
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
    return await knex('sales').where({ to_integrate: true })
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
}

export default new SalesRepository()
