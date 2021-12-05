import { ProductCategory } from './productCategory'

export interface Product {
  id: string
  product_id: number
  product_store_id: number
  category_id: number
  name: string
  category_name: string
  price_unit: number
  category: ProductCategory
  unity_taxable: string
  cod_ncm: number
  cfop: number
  price_taxable: number
  icms_tax_situation: number
  icms_origin: number
  additional_information: string
}
export interface ProductByCategory {
  category: string
  products: Product[]
}
