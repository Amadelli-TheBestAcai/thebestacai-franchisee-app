import HandlersRepository from '../repositories/HandlersRepository'
import { CreateHandlerDTO } from '../models/dtos/handler/CreateHandlerDTO'
import { getNow } from '../utils/DateHandler'

class HandlersService {
  async create(payload): Promise<void> {
    const handler: CreateHandlerDTO = { ...payload, created_at: getNow() }
    await HandlersRepository.create(handler)
  }
}

export default new HandlersService()
