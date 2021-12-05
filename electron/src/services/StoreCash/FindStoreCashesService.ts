import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { IStoreRepository } from '../../repositories/interfaces/IStoreRepository'
import StoreRepository from '../../repositories/StoreRepository'

type Response = {
  cashier: string
  avaliable: boolean
}

class FindStoreCashesService {
  private _storeRepository: IStoreRepository
  constructor(storeRepository: IStoreRepository = new StoreRepository()) {
    this._storeRepository = storeRepository
  }

  async execute(): Promise<Response[]> {
    const isOnline = await checkInternet()
    if (isOnline) {
      const { store_id: store } = await this._storeRepository.findCurrent()
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
    } else {
      return [
        { cashier: '01', avaliable: false },
        { cashier: '02', avaliable: false },
        { cashier: '03', avaliable: false },
        { cashier: '04', avaliable: false },
        { cashier: '05', avaliable: false },
        { cashier: 'OFFLINE', avaliable: true },
      ]
    }
  }
}

export default new FindStoreCashesService()
