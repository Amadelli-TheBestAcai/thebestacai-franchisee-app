import knex from '../database'
import { Payment } from '../models/Payment'
import { CreatePaymentDTO } from '../models/dtos/payments/CreatePaymentDTO'
class PaymentsRepository {
  async create(payments: CreatePaymentDTO[]) {
    return await knex('payments').insert(payments)
  }

  async getBySale(sale_id: string): Promise<Payment[]> {
    return await knex('payments').where({ sale_id })
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await knex('payments').where({ sale_id }).del()
  }
}

export default new PaymentsRepository()
