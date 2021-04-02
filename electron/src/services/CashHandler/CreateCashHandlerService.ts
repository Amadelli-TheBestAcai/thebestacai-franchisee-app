import { DeepPartial } from 'typeorm'
import api from '../../utils/Api'
import { checkInternet } from '../../utils/InternetConnection'

import { ICashHandlerRepository } from '../../repositories/interfaces/ICashHandlerRepository'
import CashHandlerRepository from '../../repositories/CashHandlerRepository'
import { IStoreCashRepository } from '../../repositories/interfaces/IStoreCashRepository'
import StoreCashRepository from '../../repositories/StoreCashRepository'

import { CashHandler } from '../../models/entities'

type Request = {
  cashHandler: DeepPartial<CashHandler>
  sendToShop: boolean
  shopOrder: {
    store_id: number
    due_date: string
    pay_date: string
    payment_method: number
    total: number
    name: string
    purchasesItems: {
      product_id: number
      quantity: number
      unitary_value: number
      category_id: number
      observation: string
    }[]
  }
}

class CreateCashHandlerService {
  private _cashHandlerRepository: ICashHandlerRepository
  private _storeCashRepository: IStoreCashRepository
  constructor(
    cashHandlerRepository: ICashHandlerRepository = new CashHandlerRepository(),
    storeCashRepository: IStoreCashRepository = new StoreCashRepository()
  ) {
    this._cashHandlerRepository = cashHandlerRepository
    this._storeCashRepository = storeCashRepository
  }

  async execute({
    cashHandler,
    sendToShop,
    shopOrder,
  }: Request): Promise<CashHandler> {
    const currentCash = await this._storeCashRepository.getOne()
    const hasInternet = checkInternet()

    let order_id = null
    if (hasInternet && sendToShop) {
      const {
        data: { id: orderId },
      } = await api.post('/purchases', shopOrder)
      order_id = orderId
    }

    return await this._cashHandlerRepository.create({
      ...cashHandler,
      cash_id: currentCash.cash_id,
      cash_code: currentCash.code,
      store_id: currentCash.store_id,
      cash_history_id: currentCash.history_id,
      to_integrate: true,
      order_id,
    })
  }
}

export default new CreateCashHandlerService()
