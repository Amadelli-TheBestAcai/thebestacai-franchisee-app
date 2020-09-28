import knex from '../database'
import { Payment } from '../models/Payment'

class PaymentsRepository {
  async create(payments: Payment) {
    return await knex('payments').insert(payments)
  }

  async getBySale(sale_id: string): Promise<Payment[]> {
    return await knex('payments').where({ sale_id })
  }

  async deleteById(id: string): Promise<void> {
    await knex('payments').where({ id }).del()
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await knex('payments').where({ sale_id }).del()
  }
}

export default new PaymentsRepository()
