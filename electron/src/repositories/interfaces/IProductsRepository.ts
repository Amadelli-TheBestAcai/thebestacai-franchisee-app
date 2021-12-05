import { DeepPartial } from 'typeorm'
import Product from '../../models/entities/Product'

export interface IProductsRepository {
  createMany(payload: DeepPartial<Product[]>): Promise<Product[]>
  deleteAll(): Promise<void>
  getSelfService(): Promise<Product>
  getAll(): Promise<Product[]>
  getByProductId(product_id: number): Promise<Product>
}
