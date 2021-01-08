import HandlersRepository from '../repositories/HandlersRepository'
import CashierService from '../services/CashierService'
import IntegrateService from '../services/IntegrateService'

import { CreateHandlerDTO } from '../models/dtos/handler/CreateHandlerDTO'
import { UpdateHandlerDTO } from '../models/dtos/handler/UpdateHandlerDTO'

import { getNow } from '../utils/DateHandler'

import { v4 as uuidv4 } from 'uuid'
import api from '../utils/Api'
import { checkInternet } from '../utils/InternetConnection'
import { sendLog } from '../utils/ApiLog'
class HandlersService {
  async create(payload): Promise<void> {
    const currentCash = await CashierService.getCurrentCashier()
    const handler: CreateHandlerDTO = {
      ...payload,
      id: uuidv4(),
      cash_id: currentCash.cash_id,
      cash_code: currentCash.code,
      store_id: currentCash.store_id,
      cash_history_id: currentCash.history_id,
      to_integrate: true,
      created_at: getNow(),
    }
    await HandlersRepository.create(handler)
    const hasInternet = await checkInternet()
    if (hasInternet) {
      await IntegrateService.integrateOnlineHandlers()
    }
  }

  async update(id: string, payload: UpdateHandlerDTO): Promise<void> {
    await HandlersRepository.update(id, payload)
  }

  async getHandlerByCash(): Promise<{ isConnected: boolean; data: any[] }> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        isConnected,
        data: [],
      }
    }
    const currentCash = await CashierService.getCurrentCashier()
    if (!currentCash || currentCash?.is_opened !== 1) {
      return {
        isConnected,
        data: [],
      }
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return {
        isConnected,
        data: [],
      }
    }
    const {
      data: { data },
    } = await api.get(`/cash_handler/${store_id}-${code}`)
    return {
      isConnected,
      data,
    }
  }

  async delete(id: number): Promise<{ success: boolean; data: any[] }> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        success: false,
        data: [],
      }
    }

    const currentCash = await CashierService.getCurrentCashier()
    if (!currentCash || currentCash?.is_opened !== 1) {
      return {
        success: false,
        data: [],
      }
    }
    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return {
        success: false,
        data: [],
      }
    }

    try {
      await api.delete(`/cash_handler/${id}`)
      const {
        data: { data },
      } = await api.get(`/cash_handler/${store_id}-${code}`)
      return {
        success: true,
        data: data || [],
      }
    } catch (err) {
      sendLog({
        title: 'Erro deletar movimentação pela api',
        payload: { err: err.message, params: { id } },
      })
      console.log(err)
      return {
        success: false,
        data: [],
      }
    }
  }
}

export default new HandlersService()
