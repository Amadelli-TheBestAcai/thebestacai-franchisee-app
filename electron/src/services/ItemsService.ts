import ItemsRepository from '../repositories/ItemsRepository'
import { Item } from '../models/Item'
import { IntegrateItemDTO } from '../models/dtos/items/IntegrateItemDTO'
class ItemsService {
  async create(items, sale_id) {
    const itemsWithSaleId = items.map((item) => ({ ...item, sale_id }))
    return await ItemsRepository.create(itemsWithSaleId)
  }

  async getBySale(sale_id: string): Promise<Item[]> {
    return await ItemsRepository.getBySale(sale_id)
  }

  async getItemsToIntegrate(sale_id: string): Promise<IntegrateItemDTO[]> {
    const items = await ItemsRepository.getBySale(sale_id)
    return items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }))
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await ItemsRepository.deleteBySale(sale_id)
  }
}

export default new ItemsService()
