import knex from '../database'
import { Handler } from '../models/Handler'
import { CreateHandlerDTO } from '../models/dtos/handler/CreateHandlerDTO'
import { UpdateHandlerDTO } from '../models/dtos/handler/UpdateHandlerDTO'

class HandlersRepository {
  async create(handler: CreateHandlerDTO): Promise<void> {
    await knex('handlers').insert(handler)
  }

  async update(id: string, payload: UpdateHandlerDTO): Promise<void> {
    await knex('handlers').where({ id }).update(payload)
  }
}

export default new HandlersRepository()
