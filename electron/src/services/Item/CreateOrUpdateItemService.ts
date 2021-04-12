import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

import { CreateItemDTO } from '../../models/dtos/items/CreateItemDTO'

class CreateOrUpdateItemService {
  private _itemRepository: IItemsRepository

  constructor(itemRepository: IItemsRepository = new ItemsRepository()) {
    this._itemRepository = itemRepository
  }

  async execute(item: CreateItemDTO, sale_id: string): Promise<void> {
    const oldItem = await this._itemRepository.getByProductAndSale(
      item.product_id,
      sale_id
    )
    if (oldItem && oldItem.category_id !== 1) {
      const payload: CreateItemDTO = {
        ...oldItem,
        total: +oldItem.total + +item.total,
        quantity: +oldItem.quantity + +item.quantity,
      }
      await this._itemRepository.update(oldItem.id, payload)
    } else {
      const payload: CreateItemDTO = {
        ...item,
        sale_id,
      }
      await this._itemRepository.create(payload)
    }
    await this.updateQuantityAndTotal(sale_id)
  }
}

export default new CreateOrUpdateItemService()
