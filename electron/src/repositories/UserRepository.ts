import knex from '../database'

class UserRepository {
  async create(payload) {
    return await knex('users').insert(payload).returning('*')
  }

  async findByUsername(username: string) {
    const users = await knex('users').where({
      username,
    })
    return users[0]
  }

  async deleteById(id: string) {
    return await knex('users')
      .where({
        id,
      })
      .del()
  }
}

export default new UserRepository()
