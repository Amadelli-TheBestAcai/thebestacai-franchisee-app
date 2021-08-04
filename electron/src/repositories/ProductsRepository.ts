import { Repository, getRepository, DeepPartial } from 'typeorm'
import Product from '../models/entities/Product'

import { IProductsRepository } from './interfaces/IProductsRepository'

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>

  constructor() {
    this.ormRepository = getRepository(Product)
  }

  async createMany(payload: DeepPartial<Product[]>): Promise<Product[]> {
    const products = await this.ormRepository.create(payload)
    await this.ormRepository.save(products)
    return products
  }

  async deleteAll(): Promise<void> {
    await this.ormRepository.delete({})
  }

  async getSelfService(): Promise<Product> {
    return await this.ormRepository.findOne({ where: { product_id: 1 } })
  }

  async getAll(): Promise<Product[]> {
    return await this.ormRepository.find({ loadEagerRelations: true })
  }

  async getByProductId(product_id: number): Promise<Product> {
    return await this.ormRepository.findOne({ where: { product_id } })
  }
}

export default ProductsRepository
