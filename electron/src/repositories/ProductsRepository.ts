import knex from '../database'

class ProductsRepository {
  async create(products) {
    return await knex('products').insert(products)
  }

  async deleteAll() {
    return await knex('products').del()
  }

  async getSelfService() {
    const item = await knex('products').where({ product_id: 1 })
    return item[0]
  }

  async getAll() {
    return await knex('products')
  }
}

export default new ProductsRepository()
