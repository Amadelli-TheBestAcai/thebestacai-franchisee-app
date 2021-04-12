import { IItemsRepository } from '../../repositories/interfaces/IItemsRepository'
import ItemsRepository from '../../repositories/ItemsRepository'

import { TokenUserDTO } from '../../models/dtos/user/TokenUserDTO'

type Response = {
  product_id: number
  store_product_id: number
  quantity: number
  update_stock: boolean
  user_id: number
}

class GetItemsToIntegrateService {
  private _itemRepository: IItemsRepository

  constructor(itemRepository: IItemsRepository = new ItemsRepository()) {
    this._itemRepository = itemRepository
  }

  async execute(sale_id: string, user: TokenUserDTO): Promise<Response[]> {
    const items = await this._itemRepository.getBySale(sale_id)
    return items.map((item) => ({
      product_id: item.product_id,
      store_product_id: item.product_store_id,
      quantity: item.quantity,
      update_stock: item.category_id !== 1,
      user_id: user.id,
    }))
  }
}

export default new GetItemsToIntegrateService()
