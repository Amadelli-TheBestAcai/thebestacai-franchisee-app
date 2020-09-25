import ItemsRepository from '../repositories/ItemsRepository'
import { Item } from '../models/Item'
import { IntegrateItemDTO } from '../models/dtos/items/IntegrateItemDTO'
import { CreateItemDTO } from '../models/dtos/items/CreateItemDTO'
class ItemsService {
  async createOrUpdate(item: CreateItemDTO, sale_id: string): Promise<void> {
    const oldItem = await ItemsRepository.getByProductAndSale(
      item.product_id,
      sale_id
    )
    if (oldItem) {
      const payload: CreateItemDTO = {
        ...oldItem,
        total: +oldItem.total + +item.total,
        quantity: +oldItem.quantity + 1,
      }
      await ItemsRepository.update(oldItem.id, payload)
    } else {
      const payload: CreateItemDTO = { ...item, quantity: 1, sale_id }
      await ItemsRepository.create(payload)
    }
  }

  async getBySale(sale_id: string): Promise<Item[]> {
    return await ItemsRepository.getBySale(sale_id)
  }

  async getTotalBySale(sale_id: string): Promise<number> {
    const items = await ItemsRepository.getBySale(sale_id)
    const total = items.reduce((total, item) => total + +item.total, 0)
    return total
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
