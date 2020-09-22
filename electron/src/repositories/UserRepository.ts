import knex from '../database'
import {User} from '../models/User'

class UserRepository {
  async create(payload) {
    return await knex('users').insert(payload)
  }

  async findByUsername(username: string): Promise<User>{
    const users = await knex('users').where({
      username,
    })
    return users[0]
  }

  async deleteById(id: number){
    return await knex('users')
      .where({
        id,
      })
      .del()
  }

  async deleteSessionUser(id: string) {
    await knex('session_user')
      .where({
        id,
      })
      .del()
  }

  async getSessionUser() {
    const response = await knex('session_user')
    return response[0]
  }

  async updateSessionUser(payload) {
    return await knex('session_user').insert(payload)
  }
}

export default new UserRepository()
