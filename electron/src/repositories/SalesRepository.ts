import knex from '../database'

class SalesRepository {
  async create(sales) {
    return await knex('sales').insert(sales)
  }
}

export default new SalesRepository()
