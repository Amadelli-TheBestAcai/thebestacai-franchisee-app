import { ProductCategory } from './productCategory'

export interface Product {
  product_store_id: number
  product_id: number
  category_id: number
  name: string
  price_unit: number
  category: ProductCategory
}
export interface ProductByCategory {
  category: string
  products: Product[]
}
