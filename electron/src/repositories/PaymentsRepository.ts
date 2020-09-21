import knex from '../database'

class PaymentsRepository {
  async create(payments) {
    return await knex('payments').insert(payments)
  }
}

export default new PaymentsRepository()
