import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import { getTotalAndQuantity } from '../../utils/ItemsHandler'

class UpdateTotalSaleService {
  private _itemRepository: IItemsRepository
  private _saleRepository: ISalesRepository

  constructor(
    itemRepository: IItemsRepository = new ItemsRepository(),
    saleRepository: ISalesRepository = new SalesRepository()
  ) {
    this._itemRepository = itemRepository
    this._saleRepository = saleRepository
  }

  async execute(sale: string): Promise<void> {
    const items = await this._itemRepository.getBySale(sale)
    const newTotalAndQuantity = getTotalAndQuantity(items)
    await this._saleRepository.update(sale, { ...newTotalAndQuantity })
  }
}

export default new UpdateTotalSaleService()
