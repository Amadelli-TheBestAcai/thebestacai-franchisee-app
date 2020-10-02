import knex from '../database'
import { CreateHandlerDTO } from '../models/dtos/handler/CreateHandlerDTO'

class HandlersRepository {
  async create(handler: CreateHandlerDTO): Promise<void> {
    await knex('handlers').insert(handler)
  }
}

export default new HandlersRepository()
