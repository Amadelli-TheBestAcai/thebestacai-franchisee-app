import ItemsRepository from '../repositories/ItemsRepository'
import SalesRepository from '../repositories/SalesRepository'

import { Item } from '../models/Item'
import { IntegrateItemDTO } from '../models/dtos/items/IntegrateItemDTO'
import { CreateItemDTO } from '../models/dtos/items/CreateItemDTO'

import { getTotalAndQuantity } from '../utils/ItemsHandler'

import { v4 as uuidv4 } from 'uuid'
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
      const newItems = await ItemsRepository.getBySale(sale_id)
      const newTotalAndQuantity = getTotalAndQuantity(newItems)
      await SalesRepository.update(sale_id, { ...newTotalAndQuantity })
    } else {
      const payload: CreateItemDTO = {
        id: uuidv4(),
        ...item,
        quantity: 1,
        sale_id,
      }
      await ItemsRepository.create(payload)
      const newItems = await ItemsRepository.getBySale(sale_id)
      const newTotalAndQuantity = getTotalAndQuantity(newItems)
      await SalesRepository.update(sale_id, { ...newTotalAndQuantity })
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

  async decressQuantity(id: string, sale_id: string): Promise<void> {
    const item = await ItemsRepository.findById(id)
    const quantity = +item.quantity - 1
    const total = +item.total - +item.price_unit
    if (quantity === 0) {
      await ItemsRepository.deleteById(id)
    } else {
      await ItemsRepository.update(id, { quantity, total })
    }
    const newItems = await ItemsRepository.getBySale(sale_id)
    const newTotalAndQuantity = getTotalAndQuantity(newItems)
    await SalesRepository.update(sale_id, { ...newTotalAndQuantity })
  }
}

export default new ItemsService()
