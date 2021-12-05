import { DeepPartial } from 'typeorm'
import ProductCategory from '../../models/entities/ProductCategory'

export interface IProductCategoryRepository {
  createMany(
    payload: DeepPartial<ProductCategory[]>
  ): Promise<ProductCategory[]>
  deleteAll(): Promise<void>
  getSelfService(): Promise<ProductCategory>
  getAll(): Promise<ProductCategory[]>
  getByProductId(product_id: number): Promise<ProductCategory>
}
