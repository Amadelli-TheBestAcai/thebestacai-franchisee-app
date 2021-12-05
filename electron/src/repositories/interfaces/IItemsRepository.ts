import { DeepPartial } from 'typeorm'
import Item from '../../models/entities/Item'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export interface IItemsRepository {
  create(payload: DeepPartial<Item>): Promise<Item>
  update(id: string, payload: QueryDeepPartialEntity<Item>): Promise<void>
  updateBySale(
    sale_id: string,
    payload: QueryDeepPartialEntity<Item>
  ): Promise<void>
  updateByProductAndSale(
    product_id: number,
    sale_id: string,
    payload: QueryDeepPartialEntity<Item>
  ): Promise<void>
  getByProductAndSale(product_id: number, sale_id: string): Promise<Item>
  getBySale(sale_id: string): Promise<Item[]>
  deleteBySale(sale_id: string): Promise<void>
  findById(id: string): Promise<Item>
  deleteById(id: string): Promise<void>
  getTotalBySale(sale_id: string): Promise<number>
}
