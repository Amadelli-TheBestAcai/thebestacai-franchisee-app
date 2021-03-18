import ItemsRepository from '../repositories/ItemsRepository'
import SalesRepository from '../repositories/SalesRepository'
import GetDecodedTokenService from '../services/User/GetDecodedTokenService'

import { Item } from '../models/Item'
import { IntegrateItemDTO } from '../models/dtos/items/IntegrateItemDTO'
import { CreateItemDTO } from '../models/dtos/items/CreateItemDTO'
import { UpdateItemDTO } from '../models/dtos/items/UpdateItemDTO'

import { getTotalAndQuantity } from '../utils/ItemsHandler'

import { v4 as uuidv4 } from 'uuid'
class ItemsService {
  async createOrUpdate(item: CreateItemDTO, sale_id: string): Promise<void> {
    const oldItem = await ItemsRepository.getByProductAndSale(
      item.product_id,
      sale_id
    )
    if (oldItem && oldItem.category_id !== 1) {
      const payload: CreateItemDTO = {
        ...oldItem,
        total: +oldItem.total + +item.total,
        quantity: +oldItem.quantity + +item.quantity,
      }
      await ItemsRepository.update(oldItem.id, payload)
    } else {
      const payload: CreateItemDTO = {
        id: uuidv4(),
        ...item,
        sale_id,
      }
      await ItemsRepository.create(payload)
    }
    await this.updateQuantityAndTotal(sale_id)
  }

  async getBySale(sale_id: string): Promise<Item[]> {
    return await ItemsRepository.getBySale(sale_id)
  }

  async getByProductAndSale(sale: string, product: number): Promise<Item> {
    return await ItemsRepository.getByProductAndSale(product, sale)
  }

  async getTotalBySale(sale_id: string): Promise<number> {
    const items = await ItemsRepository.getBySale(sale_id)
    const total = items.reduce((total, item) => total + +item.total, 0)
    return total
  }

  async getItemsToIntegrate(sale_id: string): Promise<IntegrateItemDTO[]> {
    const items = await ItemsRepository.getBySale(sale_id)
    const user = await GetDecodedTokenService.execute()
    return items.map((item) => ({
      product_id: item.product_id,
      store_product_id: item.product_store_id,
      quantity: item.quantity,
      update_stock: item.category_id !== 1,
      user_id: user.id,
    }))
  }

  async deleteBySale(sale_id: string): Promise<void> {
    await ItemsRepository.deleteBySale(sale_id)
  }

  async decressQuantity(id: string, sale_id: string): Promise<void> {
    const item = await ItemsRepository.findById(id)
    const quantity = +item.quantity - 1
    const total = +item.total - +item.price_unit
    if (!quantity || quantity === 0 || item.product_id === 1) {
      await ItemsRepository.deleteById(id)
    } else {
      await ItemsRepository.update(id, { quantity, total })
    }
    const newItems = await ItemsRepository.getBySale(sale_id)
    const newTotalAndQuantity = getTotalAndQuantity(newItems)
    await SalesRepository.update(sale_id, { ...newTotalAndQuantity })
  }

  async updateByProductAndSale(
    product: number,
    sale: string,
    payload: UpdateItemDTO
  ): Promise<void> {
    await ItemsRepository.updateByProductAndSale(product, sale, payload)
  }

  async updateQuantityAndTotal(sale: string): Promise<void> {
    const items = await ItemsRepository.getBySale(sale)
    const newTotalAndQuantity = getTotalAndQuantity(items)
    await SalesRepository.update(sale, { ...newTotalAndQuantity })
  }
}

export default new ItemsService()
