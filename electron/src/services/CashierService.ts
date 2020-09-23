import api from '../utils/Api'
import UserService from './UserService'
class CashierService {
  async getOnlineCashes(): Promise<{ cashier: string; avaliable: boolean }[]> {
    const { store } = await UserService.getTokenInfo()
    const {
      data: { data },
    } = await api.get(`/store_cashes/${store}/summary`)
    const { open, closed } = data
    let cashes = open.map((cash) => ({
      cashier: cash.split('-')[1],
      avaliable: true,
    }))
    cashes = [
      ...closed.map((cash) => ({
        cashier: cash.split('-')[1],
        avaliable: false,
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
}

export default new CashierService()
