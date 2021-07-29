import { Repository, getRepository, DeepPartial } from 'typeorm'
import ProductCategory from '../models/entities/ProductCategory'

import { IProductCategoryRepository } from './interfaces/IProductCategoryRepository'

class ProductCategoryRepository implements IProductCategoryRepository {
  private ormRepository: Repository<ProductCategory>

  constructor() {
    this.ormRepository = getRepository(ProductCategory)
  }

  async createMany(
    payload: DeepPartial<ProductCategory[]>
  ): Promise<ProductCategory[]> {
    const products = await this.ormRepository.create(payload)
    await this.ormRepository.save(products)
    return products
  }

  async deleteAll(): Promise<void> {
    await this.ormRepository.delete({})
  }

  async getSelfService(): Promise<ProductCategory> {
    return await this.ormRepository.findOne({ where: { product_id: 1 } })
  }

  async getAll(): Promise<ProductCategory[]> {
    return await this.ormRepository.find()
  }

  async getByProductId(product_id: number): Promise<ProductCategory> {
    return await this.ormRepository.findOne({ where: { product_id } })
  }
}

export default ProductCategoryRepository
