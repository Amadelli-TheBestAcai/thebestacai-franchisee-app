import api from '../utils/Api'

import UserService from './UserService'

import CashierRepository from '../repositories/CashierRepository'

import { checkInternet } from '../utils/InternetConnection'

import { Cashier } from '../models/Cashier'
import { OpenCashierDTO } from '../models/dtos/Cashier/OpenCashierDTO'
import { CloseCashierDTO } from '../models/dtos/Cashier/CloseCashierDTO'
import { CreateCashierDTO } from '../models/dtos/Cashier/CreateCashierDTO'
class CashierService {
  async getOnlineCashes(): Promise<{ cashier: string; avaliable: boolean }[]> {
    const { store } = await UserService.getTokenInfo()
    const {
      data: { data },
    } = await api.get(`/store_cashes/${store}/summary`)
    const { open, closed } = data
    let cashes = open.map((cash) => ({
      cashier: cash.split('-')[1],
      avaliable: false,
    }))

    cashes = [
      ...closed.map((cash) => ({
        cashier: cash.split('-')[1],
        avaliable: true,
      })),
      ...cashes,
    ]

    cashes = cashes.sort(
      (firstCash, secondCash) => +firstCash.cashier - +secondCash.cashier
    )
    return cashes
  }

  async getOfflineCashes(): Promise<{ cashier: string; avaliable: boolean }[]> {
    const cashes = [
      { cashier: '01', avaliable: false },
      { cashier: '02', avaliable: false },
      { cashier: '03', avaliable: false },
      { cashier: '04', avaliable: false },
      { cashier: '05', avaliable: false },
      { cashier: 'OFFLINE', avaliable: true },
    ]
    return cashes
  }

  async getCashes(): Promise<{ cashier: string; avaliable: boolean }[]> {
    const isConnected = await checkInternet()
    if (isConnected) {
      return await this.getOnlineCashes()
    }
    return await this.getOfflineCashes()
  }

  async openCashier({ code, amount_on_open }: OpenCashierDTO): Promise<void> {
    const isConnected = await checkInternet()
    let newCashier: CreateCashierDTO = { code, is_opened: true }
    if (isConnected) {
      const { store } = await UserService.getTokenInfo()
      const {
        data: {
          data: { cash_id, history_id, store_id },
        },
      } = await api.put(`/store_cashes/${store}-${code}/open`, {
        amount_on_open,
      })
      newCashier = { cash_id, history_id, store_id, ...newCashier }
    }
    await CashierRepository.delete()
    await CashierRepository.create(newCashier)
  }

  async closeCashier({
    code,
    amount_on_close,
  }: CloseCashierDTO): Promise<void> {
    const isConnected = await checkInternet()
    if (isConnected) {
      const { store } = await UserService.getTokenInfo()
      await api.put(`/store_cashes/${store}-${code}/close`, { amount_on_close })
    }
    const { id } = await this.getCurrentCashier()
    await CashierRepository.findAndUpdate(id, { is_opened: false })
  }

  async getCurrentCashier(): Promise<Cashier | null> {
    return await CashierRepository.get()
  }

  async getCurrentCashHistory(): Promise<{
    cash: string
    is_opened: boolean
    history: any
  } | null> {
    const cashier = await this.getCurrentCashier()
    if (cashier) {
      const { code, store_id, is_opened } = cashier
      const {
        data: { history },
      } = await api.get(`/current_cash_history/${store_id}-${code}`)
      return {
        cash: code,
        is_opened,
        history,
      }
    } else {
      return null
    }
  }
}

export default new CashierService()
