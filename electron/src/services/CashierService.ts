import api from '../utils/Api'

import GetCurrentStoreService from './Store/GetCurrentStoreService'
import SalesService from './SalesService'
import IntegrateService from './IntegrateService'

import CashierRepository from '../repositories/CashierRepository'

import { checkInternet } from '../utils/InternetConnection'
import { getBalance } from '../utils/BalanceFormater'

import { Cashier } from '../models/Cashier'
import { OpenCashierDTO } from '../models/dtos/Cashier/OpenCashierDTO'
import { CloseCashierDTO } from '../models/dtos/Cashier/CloseCashierDTO'
import { CreateCashierDTO } from '../models/dtos/Cashier/CreateCashierDTO'
class CashierService {
  async getOnlineCashes(): Promise<{ cashier: string; avaliable: boolean }[]> {
    const { id: store } = await GetCurrentStoreService.execute()
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
    let newCashier: CreateCashierDTO = { code, is_opened: true, amount_on_open }
    if (isConnected) {
      const { id: store } = await GetCurrentStoreService.execute()
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
      await IntegrateService.integrateOnlineSales()
      await IntegrateService.integrateOnlineHandlers()
      const { id: store } = await GetCurrentStoreService.execute()
      await api.put(`/store_cashes/${store}-${code}/close`, { amount_on_close })
    }
    const { id } = await this.getCurrentCashier()
    await this.closeLocalCashier(id)
  }

  async closeLocalCashier(id: number): Promise<void> {
    await CashierRepository.findAndUpdate(id, { is_opened: false })
  }

  async getCurrentCashier(): Promise<Cashier> {
    return await CashierRepository.get()
  }

  async getCurrentCashHistory(): Promise<{
    cashier: Cashier
    history: any
  } | null> {
    const cashier = await this.getCurrentCashier()
    if (cashier && cashier.history_id) {
      const { code, store_id } = cashier
      const {
        data: { history },
      } = await api.get(`/current_cash_history/${store_id}-${code}`)
      return {
        cashier,
        history,
      }
    } else {
      return null
    }
  }

  async getBalance(): Promise<{ isConnected: boolean; balance: any }> {
    const { isConnected, sales, appSales } = await SalesService.getFromApi(true)
    const balance = getBalance(sales, appSales)
    return {
      isConnected,
      balance,
    }
  }

  async updateObservation(observation: string): Promise<void> {
    const { history_id } = await CashierRepository.get()

    await api.put(`/cash_history/${history_id}`, { observation })
  }
}

export default new CashierService()
