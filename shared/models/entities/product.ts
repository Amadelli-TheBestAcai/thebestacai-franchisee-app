import { ProductCategory } from './productCategory'

export interface Product {
  name: string
  price_buy: number
  created_at: string
  product_id: number
  price_unit: string
  category: ProductCategory
}
