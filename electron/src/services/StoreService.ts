import api from '../utils/Api'

import UserService from './UserService'
import StoreRepository from '../repositories/StoreRepository'

import { CreateStoreDTO } from '../../../shared/dtos/store/CreateStoreDTO'
import { Store } from '../../../shared/models/store'

import { checkInternet } from '../utils/InternetConnection'

class StoreService {
  async create(storeId: CreateStoreDTO): Promise<void> {
    const isOnline = await checkInternet()
    if (isOnline) {
      const store = await StoreRepository.getOne()
      if (!store) {
        const {
          data: {
            data: { id, cnpj, company_name, token_nfce_production },
          },
        } = await api.get(`/stores?id=${storeId}`)

        await StoreRepository.create({
          id,
          cnpj,
          company_name,
          token_nfce: token_nfce_production,
        })
      }
    }
  }

  async getStoreByUser(): Promise<{ id: number; name: string }[]> {
    const isOnline = await checkInternet()
    if (isOnline) {
      const { franchisee } = await UserService.getTokenInfo()
      const {
        data: { data },
      } = await api.get(`/stores?franchiseeId=${franchisee}`)
      const formatedStores = data.map((store) => ({
        id: store.id,
        name: store.company_name,
      }))
      return formatedStores
    } else {
      return []
    }
  }

  async getOne(): Promise<Store> {
    return await StoreRepository.getOne()
  }
}

export default new StoreService()
