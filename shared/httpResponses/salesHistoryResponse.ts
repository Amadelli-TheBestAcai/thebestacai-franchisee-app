export interface SalesHistory {
  id: number
  quantity: number
  change_amount: string
  type: number
  discount: string
  item: ItemResponse[]
  total_sold: number
  payments: PaymentResponse[]
  created_at: string
  deleted_at: string
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
}

export interface ItemProductResponse {
  id: string
  name: string
  category_id: ItemCategoryResponse
  price_buy: string
  created_at: string
  deleted_at: string
}

export interface ItemCategoryResponse {
  id: string
  name: string
  created_at: string
  deleted_at: string
}
