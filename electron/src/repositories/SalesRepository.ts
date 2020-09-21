import knex from '../database'
import k from 'knex'
class SalesRepository {
  async create(sales) {
    return await knex('sales').insert(sales)
  }
}

export default new SalesRepository()
