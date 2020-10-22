import { ItemResponse } from './itemResponse'
import { PaymentResponse } from './PaymentResponse'

export interface SaleResponse {
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
