import { ProductCategory } from './productCategory'

export interface Product {
  product_id: number
  name: string
  price_unit: number
  category: ProductCategory
}
export interface ProductByCategory {
  category: string
  products: Product[]
}
