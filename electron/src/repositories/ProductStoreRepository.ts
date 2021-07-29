import { Repository, getRepository, DeepPartial } from 'typeorm'
import ProductStore from '../models/entities/ProductStore'

import { IProductStoreRepository } from './interfaces/IProductStoreRepository'

class ProductStoreRepository implements IProductStoreRepository {
  private ormRepository: Repository<ProductStore>

  constructor() {
    this.ormRepository = getRepository(ProductStore)
  }

  async createMany(
    payload: DeepPartial<ProductStore[]>
  ): Promise<ProductStore[]> {
    const products = await this.ormRepository.create(payload)
    await this.ormRepository.save(products)
    return products
  }

  async deleteAll(): Promise<void> {
    await this.ormRepository.delete({})
  }

  async getSelfService(): Promise<ProductStore> {
    return await this.ormRepository.findOne({ where: { product_id: 1 } })
  }

  async getAll(): Promise<ProductStore[]> {
    return await this.ormRepository.find()
  }

  async getByProductId(product_id: number): Promise<ProductStore> {
    return await this.ormRepository.findOne({ where: { product_id } })
  }
}

export default ProductStoreRepository
