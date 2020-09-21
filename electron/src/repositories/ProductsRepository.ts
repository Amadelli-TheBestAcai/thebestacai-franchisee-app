import knex from '../database'

class ProductsRepository {
  async create(products) {
    return await knex('products').insert(products)
  }

  async deleteAll() {
    return await knex('products').del()
  }

  async getAll() {
    return await knex('products')
  }
}

export default new ProductsRepository()
