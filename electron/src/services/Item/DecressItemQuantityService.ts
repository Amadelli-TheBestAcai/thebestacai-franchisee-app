import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

class DecressItemQuantityService {
  private _itemRepository: IItemsRepository

  constructor(itemRepository: IItemsRepository = new ItemsRepository()) {
    this._itemRepository = itemRepository
  }

  async execute(id: string): Promise<void> {
    const item = await this._itemRepository.findById(id)
    const quantity = +item.quantity - 1
    const total = +item.total - +item.price_unit
    if (!quantity || quantity === 0 || item.product_id === 1) {
      await this._itemRepository.deleteById(id)
    } else {
      await this._itemRepository.update(id, { quantity, total })
    }
  }
}

export default new DecressItemQuantityService()
