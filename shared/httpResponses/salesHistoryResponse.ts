export interface SalesHistory {
  id: number
  quantity: number
  change_amount: string
  type: number
  total_sold: number
  discount: string
  nfce_ref?: string
  created_at: string
  deleted_at?: number
  payments: PaymentResponse[]
  item: ItemResponse[]
}

export interface PaymentResponse {
  id: number
  amount: string
  type: number
  created_at: string
  deleted_at: string
}

export interface ItemResponse {
  id: string
  product_id: ItemProductResponse
  quantity: string
  created_at: string
  deleted_at: string
  storeProduct: StoreProductResponse
}

export interface ItemProductResponse {
  id: string
  name: string
  category_id: ItemCategoryResponse
  price_buy: string
  price_sell: string
  created_at: string
  deleted_at: string
}

export interface ItemCategoryResponse {
  id: string
  name: string
  sort?: number
  created_at: string
  deleted_at: string
}

export interface StoreProductResponse {
  id: number
  product_id: number
  store_id: number
  price_unit: string
  permission: boolean
  price_sell?: string
  unity?: string
  unity_taxable?: string
  price_taxable?: string
  cfop?: number
  icms_origin?: number
  icms_tax_situation?: string
  tax_regime?: number
  pis_tax_situation?: string
  pis_aliquot_value?: string
  pis_aliquot_percentage?: string
  cofins_tax_situation?: string
  cofins_aliquot_value?: string
  cofins_aliquot_percentage?: string
  additional_information?: string
  price_permission: boolean
  icms_aliquot_percentage?: string
  bc_icms?: string
  bc_icms_st?: string
  redution_icms?: string
  aliquot_final_consumer?: string
  quantity: number
  created_at: string
  deleted_at?: string
  product: Product
}

export interface Product {
  id: number
  name: string
  category_id: number
  price_buy?: string
  permission_store: boolean
  permission_order: boolean
  permission_purchase: boolean
  cod_product?: string
  cod_ncm?: number
  brand?: string
  unity?: number
  weight?: string
  price_sell?: string
  description?: string
  created_at: string
  deleted_at?: string
  category: ItemCategoryResponse
}
