import { Payment } from './payment'

type Item = {
  quantity: number
  product_id: number
}
export interface Sale {
  change_amount: number
  type: string
  discount: number
  payments: Payment[]
  items: Item[]
}
