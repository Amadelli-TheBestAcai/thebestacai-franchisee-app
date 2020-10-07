import HandlersRepository from '../repositories/HandlersRepository'
import CashierRepository from '../repositories/CashierRepository'

import { CreateHandlerDTO } from '../models/dtos/handler/CreateHandlerDTO'

import { getNow } from '../utils/DateHandler'

import { v4 as uuidv4 } from 'uuid'
import api from '../utils/Api'
class HandlersService {
  async create(payload): Promise<void> {
    const handler: CreateHandlerDTO = {
      ...payload,
      id: uuidv4(),
      to_integrate: true,
      created_at: getNow(),
    }
    await HandlersRepository.create(handler)
  }

  async integrate(): Promise<void> {
    const handlers = await HandlersRepository.getToIntegrate()
    if (!handlers.length) {
      return
    }
    const currentCash = await CashierRepository.get()
    if (!currentCash) {
      return
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return
    }

    await Promise.all(
      handlers.map(async ({ id, created_at, ...handler }) => {
        try {
          await api.post(`/cash_handler/${store_id}-${code}`, handler)
          await HandlersRepository.update(id, { to_integrate: false })
        } catch (err) {
          console.log(err)
        }
      })
    )
  }
}

export default new HandlersService()
