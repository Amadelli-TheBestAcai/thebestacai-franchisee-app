import { Payment } from '../Payment'
import { Item } from '../Item'

export interface CreateSaleDTO {
  id: string
  change_amount: number
  type: string
  discount: number
  to_integrate: boolean
  is_current: boolean
}
