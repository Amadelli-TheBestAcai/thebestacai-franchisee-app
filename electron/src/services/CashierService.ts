import api from '../utils/Api'
import UserService from './UserService'
import CashierRepository from '../repositories/CashierRepository'
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
    return cashes
  }

  async getOfflineCashes(): Promise<{ cashier: string; avaliable: boolean }[]> {
    const cashes = [
      { cashier: '05', avaliable: false },
      { cashier: '01', avaliable: false },
      { cashier: '02', avaliable: false },
      { cashier: '03', avaliable: false },
      { cashier: '04', avaliable: false },
      { cashier: 'OFFLINE', avaliable: true },
    ]
    return cashes
  }

  async getCashes(
    isConnected: boolean
  ): Promise<{ cashier: string; avaliable: boolean }[]> {
    if (isConnected) {
      return await this.getOnlineCashes()
    }
    return await this.getOfflineCashes()
  }

  async openCashier(
    { code, amount_on_open }: OpenCashierDTO,
    isConnected: boolean
  ): Promise<void> {
    let newCashier: CreateCashierDTO = { code }
    if (isConnected) {
      const { store } = await UserService.getTokenInfo()
      const {
        data: {
          data: { cash_id, history_id, store_id },
        },
      } = await api.put(`/store_cashes/${store}-${code}/open`, {
        amount_on_open,
      })
      newCashier = { code, cash_id, history_id, store_id }
    }
    console.log(newCashier)
    await CashierRepository.delete()
    await CashierRepository.create(newCashier)
  }

  async closeCashier(
    { code, amount_on_close }: CloseCashierDTO,
    isConnected: boolean
  ): Promise<void> {
    if (isConnected) {
      const { store } = await UserService.getTokenInfo()
      await api.put(`/store_cashes/${store}-${code}/open`, { amount_on_close })
    }
    await CashierRepository.delete()
  }

  async getCurrentCashier(): Promise<Cashier | null> {
    return await CashierRepository.get()
  }
}

export default new CashierService()
