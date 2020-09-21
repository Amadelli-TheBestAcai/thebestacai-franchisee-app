import ItemsRepository from '../repositories/ItemsRepository'

class ItemsService {
  async create(items, sale_id) {
    const itemsWithSaleId = items.map((item) => ({ ...item, sale_id }))
    return await ItemsRepository.create(itemsWithSaleId)
  }
}

export default new ItemsService()
