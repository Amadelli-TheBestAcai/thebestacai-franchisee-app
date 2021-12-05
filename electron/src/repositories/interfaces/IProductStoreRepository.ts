import { DeepPartial } from 'typeorm'
import ProductStore from '../../models/entities/ProductStore'

export interface IProductStoreRepository {
  createMany(payload: DeepPartial<ProductStore[]>): Promise<ProductStore[]>
  deleteAll(): Promise<void>
  getSelfService(): Promise<ProductStore>
  getAll(): Promise<ProductStore[]>
  getByProductId(product_id: number): Promise<ProductStore>
}
