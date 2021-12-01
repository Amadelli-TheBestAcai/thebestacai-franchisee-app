import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

type Response = {
  history_id?: number
  handlers: {
    id: number
    type: number
    reason: string
    amount: string
    verified: boolean
    order_id?: number
    created_at: string
    deleted_at?: string
  }[]
}
class GetCashHandlersByStoreCashService {
  private _storeCashRepository: IStoreCashRepository
  constructor(
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._storeCashRepository = storeCashRepository
  }

  async execute(): Promise<Response> {
    const isConnected = await checkInternet()
    if (!isConnected) {
      return {
        history_id: null,
        handlers: [],
      }
    }

    const currentCash = await this._storeCashRepository.getOne()
    if (!currentCash || !currentCash.is_opened) {
      return {
        history_id: null,
        handlers: [],
      }
    }

    const { store_id, code } = currentCash
    if (!store_id || !code) {
      return {
        history_id: null,
        handlers: [],
      }
    }
    const {
      data: { data },
    } = await api.get(`/cash_handler/${store_id}-${code}`)

    return {
      history_id: currentCash.history_id,
      handlers: data,
    }
  }
}

export default new GetCashHandlersByStoreCashService()
