import knex from '../database'

class ItemsRepository {
  async create(items) {
    return await knex('items').insert(items)
  }
}

export default new ItemsRepository()
