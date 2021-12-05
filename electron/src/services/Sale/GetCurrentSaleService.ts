import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

import { IPaymentsRepository } from '../../repositories/interfaces/IPaymentsRepository'
import PaymentsRepository from '../../repositories/PaymentsRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import CreateSaleService from './CreateSaleService'

import { Sale, Item, Payment } from '../../models/entities'

type Response = {
  sale: Sale
  items: Item[]
  payments: Payment[]
}

class GetCurrentSaleService {
  private _saleRepository: ISalesRepository
  private _itemRepository: IItemsRepository
  private _paymentRepository: IPaymentsRepository

  constructor(
    saleRepository: ISalesRepository = new SalesRepository(),
    itemRepository: IItemsRepository = new ItemsRepository(),
    paymentRepository: IPaymentsRepository = new PaymentsRepository()
  ) {
    this._saleRepository = saleRepository
    this._itemRepository = itemRepository
    this._paymentRepository = paymentRepository
  }

  async execute(): Promise<Response> {
    const currentSale = await this._saleRepository.getCurrentSale()
    if (currentSale) {
      const items = await this._itemRepository.getBySale(currentSale.id)
      const payments = await this._paymentRepository.getBySale(currentSale.id)
      return { sale: currentSale, items, payments }
    } else {
      const newSale = await CreateSaleService.execute()
      return { sale: newSale, items: [], payments: [] }
    }
  }
}

export default new GetCurrentSaleService()
