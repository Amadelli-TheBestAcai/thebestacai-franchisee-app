import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

import { ISalesRepository } from '../../repositories/interfaces/ISalesRepository'
import SalesRepository from '../../repositories/SalesRepository'

import UpdateTotalSaleService from './UpdateTotalSaleService'

class TransferCommandItems {
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
    const { id: currentSale } = await this._saleRepository.getCurrentSale()
    const items = await this._itemRepository.getBySale(sale)
    await Promise.all(
      items.map(async (item) => {
        const oldItem = await this._itemRepository.getByProductAndSale(
          item.product_id,
          currentSale
        )
        if (oldItem && oldItem.product_id !== 1) {
          const newItem = {
            ...oldItem,
            quantity: +oldItem.quantity + +item.quantity,
            total: +oldItem.total + +item.total,
          }
          await this._itemRepository.updateByProductAndSale(
            item.product_id,
            currentSale,
            {
              ...newItem,
              sale_id: currentSale,
            }
          )
        } else {
          await this._itemRepository.create({ ...item, sale_id: currentSale })
        }
      })
    )
    await UpdateTotalSaleService.execute(currentSale)
    await this._itemRepository.deleteBySale(sale)
    await this._saleRepository.deleteById(sale)
  }
}

export default new TransferCommandItems()
